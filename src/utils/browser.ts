import FingerprintJS from '@fingerprintjs/fingerprintjs';
import UAParser from 'ua-parser-js';

export const getFingerprint = async () => {
  const fp = await FingerprintJS.load();
  return await fp.get();
};

export const getVisitorId = async () => {
  if (typeof window !== 'undefined') {
    return (await getFingerprint()).visitorId;
  }
  return '';
};

export const getBroswerInfo = () => {
  const parser = new UAParser();
  const info = parser.getResult();
  const { browser, os } = info;

  return {
    summary: `${browser.name} ${os.name} ${os.version}`,
    ...info,
  };
};

export const getIpAddress = async (): Promise<string> => {
  // TODO: Check further for better solution?
  const response = await fetch('https://api.ipify.org/?format=json');
  return await response.json();
};
