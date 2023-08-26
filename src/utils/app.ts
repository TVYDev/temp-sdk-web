const appOffline = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

export const getAppState = () => {
  return {
    isOffline: appOffline(),
  };
};
