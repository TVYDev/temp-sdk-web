export interface IRequiredRequestHeaders {
  'Content-Type'?:
    | 'text/html'
    | 'text/plain'
    | 'multipart/form-data'
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'application/octet-stream';
  client_id: string;
  client_secret: string;
  'x-api-key': string;
  device_id: string;
  language?: 'en' | 'km';
  app_version?: string;
  AppCode?: string;
}
