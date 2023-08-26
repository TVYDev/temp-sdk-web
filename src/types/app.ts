export interface IAppStateResponse {
  response: {
    data: {
      code: string;
      message: string;
    };
  };
}

export interface IInternalAuthUser {
  username?: string;
  token?: string;
}
