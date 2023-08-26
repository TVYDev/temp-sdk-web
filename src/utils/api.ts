import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { StatusCodes } from 'http-status-codes';
import { decompress } from 'lz-string';

import { IRequiredRequestHeaders } from '../types/api/header';
import { getAppState } from './app';
import { apiContants, appContants } from '../constants/index';
import { IInternalAuthUser, TApiAppCode } from '@/types';
import { authStorageKey } from '../constants/app';

const { apiAppCode } = apiContants;
const { appOfflineResponse, sessionExpiredResponse } = appContants;

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface InternalAxiosRequestConfig<D = any>
    extends AxiosRequestConfig<D> {
    headers: AxiosRequestHeaders;
    retry?: boolean;
  }
}

const { apiErrorCode, apiTokenType, apiUrlPath } = apiContants;

interface Queue {
  [url: string]: InternalAxiosRequestConfig;
}

class HttpRequest {
  private queue: Queue;

  constructor() {
    this.queue = {};
  }

  private destroy(url: string) {
    delete this.queue[url];
  }

  private interceptors<O, I>(instance: AxiosInstance, url: string) {
    instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<I>) => {
        return this.setAuthHeader(config);
      },
      (error: AxiosError<O, I>) => {
        return Promise.reject(error);
      }
    );
    instance.interceptors.response.use(
      (res: AxiosResponse<O, I>) => {
        this.destroy(url);
        return res;
      },
      async (error: AxiosError<O, I>) => {
        const originalConfig = error.config;
        const errorResponse = error.response;

        if (errorResponse && errorResponse !== undefined && originalConfig) {
          const appCode = originalConfig?.headers['AppCode'];

          switch (appCode) {
            case apiAppCode.IB_EXTERNAL: {
              if (this.isAccessTokenInvalidError(errorResponse)) {
                this.destroy(url);
                return Promise.reject(sessionExpiredResponse);
              } else if (
                this.isAccessTokenExpiredError(errorResponse) &&
                !originalConfig?.retry
              ) {
                try {
                  const baseUrl = new URL(error.request.responseURL);
                  const apiOrigin = baseUrl.origin;

                  await this.refreshTokenService(
                    `${apiOrigin}${apiUrlPath.IDM_AUTH_REFRESH_TOKEN}`,
                    originalConfig.headers
                  );
                } catch (e) {
                  this.destroy(url);
                  return Promise.reject(sessionExpiredResponse);
                }

                originalConfig.retry = true;
                return this.apiRequest(url, originalConfig);
              }
              break;
            }
            case apiAppCode.IB_INTERNAL:
            case apiAppCode.RE_INTERNAL: {
              if (this.isUserAuthTokenInvalidExpired(errorResponse)) {
                localStorage.removeItem(authStorageKey[appCode]);
                return Promise.reject(sessionExpiredResponse);
              }
            }
          }
        }

        this.destroy(url);
        return Promise.reject(error);
      }
    );
  }

  private setAuthHeader(config: InternalAxiosRequestConfig) {
    const clonedConfig = { ...config };
    const appCode = clonedConfig.headers['AppCode'] as TApiAppCode;

    if (
      [apiAppCode.IB_INTERNAL, apiAppCode.RE_INTERNAL].some(
        (c) => c === appCode
      )
    ) {
      const internalAuthUser = this.getInternalAuthUser(appCode);
      if (!internalAuthUser) return clonedConfig;

      clonedConfig.headers['cif'] = internalAuthUser.username;
      clonedConfig.headers['user_id'] = internalAuthUser.username;
      clonedConfig.headers[
        'Authorization'
      ] = `Bearer ${internalAuthUser.token}`;
    }

    return clonedConfig;
  }

  private getInternalAuthUser(
    apiAppCode: TApiAppCode
  ): IInternalAuthUser | undefined {
    const keyLocalStorage = authStorageKey[apiAppCode];
    const compressedData = localStorage.getItem(keyLocalStorage);
    if (!compressedData) {
      return undefined;
    }

    const decompressedData = decompress(compressedData);
    const jsonData = JSON.parse(decompressedData);
    return jsonData.state ?? undefined;
  }

  private isUserAuthTokenInvalidExpired(res: AxiosResponse) {
    const { status, data } = res;
    const { EXPIRED_TOKEN, INVALID_ACCESS_TOKEN, NOT_FOUND_TOKEN } =
      apiErrorCode.USER_AUTH;
    const errorCodes = [EXPIRED_TOKEN, INVALID_ACCESS_TOKEN, NOT_FOUND_TOKEN];

    return (
      status === StatusCodes.BAD_REQUEST &&
      errorCodes.some((c) => c === data.code)
    );
  }

  private isAccessTokenExpiredError(res: AxiosResponse) {
    const { status, data } = res;
    return (
      [StatusCodes.UNAUTHORIZED, StatusCodes.BAD_REQUEST].some(
        (s) => s === status
      ) && data.code === apiErrorCode.IB_EXTERNAL.EXPIRED_ACCESS_TOKEN
    );
  }

  private isAccessTokenInvalidError(res: AxiosResponse) {
    const { status, data } = res;
    return (
      status === StatusCodes.UNAUTHORIZED &&
      data.code === apiErrorCode.IB_EXTERNAL.INVALID_ACCESS_TOKEN
    );
  }

  private refreshTokenService(url: string, headers: AxiosRequestHeaders) {
    return axios.post(
      url,
      { grant_type: apiTokenType.REFRESH_TOKEN },
      {
        headers,
      }
    );
  }

  public async apiRequest<I, O>(url: string, options: AxiosRequestConfig<I>) {
    if (getAppState().isOffline) {
      this.destroy(url);
      return Promise.reject(appOfflineResponse);
    }

    const instance: AxiosInstance = axios.create();

    options.url = url;

    this.interceptors<O, I>(instance, url);

    return instance(options) as Promise<AxiosResponse<O, I>>;
  }
}

const httpRequestInstance = new HttpRequest();

export const apiRequest =
  httpRequestInstance.apiRequest.bind(httpRequestInstance);

export const getRequiredRequestHeaders = (
  headers: IRequiredRequestHeaders
): IRequiredRequestHeaders => ({
  'Content-Type': headers['Content-Type'] || 'application/json',
  client_id: headers.client_id,
  client_secret: headers.client_secret,
  'x-api-key': headers['x-api-key'],
  device_id: headers.device_id,
  language: headers['language'] || 'en',
  app_version: headers['app_version'] || '1.0.0',
  AppCode: headers['AppCode'] || 'APP',
});
