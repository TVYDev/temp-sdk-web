export const apiErrorCode = {
  GW_CODE: {
    GW_INVAILID: 'GW-E0001',
    GW_INVALID_TOKEN: 'GW-E0006',
    GW_INVALID_REFRESH_TOKEN: 'GW-E0009',
  },
  IB_EXTERNAL: {
    INVALID_ACCESS_TOKEN: 'MT001',
    EXPIRED_ACCESS_TOKEN: 'MT002',
  },
  USER_AUTH: {
    EXPIRED_TOKEN: 'EAU018',
    NOT_FOUND_TOKEN: 'EAU016',
    INVALID_ACCESS_TOKEN: 'EAU009',
  },
};

export const apiTokenType = {
  REFRESH_TOKEN: 'refresh_token',
};

export const apiUrlPath = {
  IDM_AUTH_REFRESH_TOKEN: '/api/idm-service/api/v1.0/oauth/token',
};

export const apiAppCode = {
  IB_INTERNAL: 'IB_INTERNAL',
  IB_EXTERNAL: 'IB_EXTERNAL',
  RE_INTERNAL: 'RE_INTERNAL',
} as const;

export const apiAuthGrantType = {
  PASSWORD: 'password',
  LDAP: 'ldap',
  REFRESH_TOKEN: 'refresh_token',
};
