import { apiAppCode, apiAuthGrantType } from '@/constants/api';

export { AxiosRequestConfig, AxiosResponse } from 'axios';
export * from './request';
export * from './response';

export type TApiAppCode = (typeof apiAppCode)[keyof typeof apiAppCode];

export type TApiAuthGrantType =
  (typeof apiAuthGrantType)[keyof typeof apiAuthGrantType];
