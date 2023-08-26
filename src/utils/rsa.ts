export const encrypt = async (
  message: string,
  publicKey: string
): Promise<string> => {
  const JSEncrypt = (await import('jsencrypt')).default;
  const jsencrypt = new JSEncrypt();
  jsencrypt.setPublicKey(publicKey);
  return jsencrypt.encrypt(message) || message;
};

export const decrypt = async (
  message: string,
  privateKey: string
): Promise<string> => {
  const JSEncrypt = (await import('jsencrypt')).default;
  const jsencrypt = new JSEncrypt();
  jsencrypt.setPrivateKey(privateKey);
  return jsencrypt.decrypt(message) || message;
};

// crypto package is deprecated
// export const createSignRSA = async (
//   contentSignature: string,
//   privateKey: string
// ): Promise<string> => {
//   const crypto = (await import('crypto')).default;
//   const sign = crypto.createSign('RSA-SHA256');
//   sign.update(contentSignature);
//   const signature = sign.sign(privateKey);
//   return signature.toString('base64') || '';
// };
