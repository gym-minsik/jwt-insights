import crypto from 'crypto';

export function signRS256(message: string, privateKey: string): string {
  const cipher = crypto
    .createSign('RSA-SHA256')
    .update(message)
    .sign(privateKey, 'base64url');

  return cipher;
}

export function verifyRS256(
  message: string,
  cipher: string,
  publicKey: string
): boolean {
  return crypto
    .createVerify('RSA-SHA256')
    .update(message)
    .verify(publicKey, cipher, 'base64url');
}
