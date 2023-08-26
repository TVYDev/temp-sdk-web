import { IAppStateResponse } from '..';
import { apiAppCode } from './api';

export const appErrorCode = {
  APP_OFFLINE: 'APP_OFFLINE',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
};

export const sessionExpiredResponse: IAppStateResponse = {
  response: {
    data: {
      code: appErrorCode.SESSION_EXPIRED,
      message: 'Your session is expired, please login again.',
    },
  },
};

export const appOfflineResponse: IAppStateResponse = {
  response: {
    data: {
      code: appErrorCode.APP_OFFLINE,
      message: 'No internet, please check your Internet connection',
    },
  },
};

export const authStorageKey: { [key: string]: string } = {
  [apiAppCode.IB_INTERNAL]: 'ib-internal-auth',
  [apiAppCode.RE_INTERNAL]: 're-internal-auth',
};
