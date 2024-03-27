import crypto from 'crypto';

export function signHS256(message: string, secretKey: string): string {
  const cipher = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('base64url');

  return cipher;
}

export function verifyHS256(
  message: string,
  cipher: string,
  secretKey: string
): boolean {
  return cipher === signHS256(message, secretKey);
}
