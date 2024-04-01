import { SupportedHmacAlgorithm } from './models/supported-signature-algorithm';
import { SecretKey } from './models/secret-key';
import crypto from 'crypto';

export function generateHmacSignature(
  message: string,
  key: SecretKey,
  algorithm: SupportedHmacAlgorithm
) {
  let hmac: crypto.Hmac | null = null;
  switch (algorithm) {
    case 'HS256':
      hmac = crypto.createHmac('sha256', key.keyObject);
      break;
  }

  return hmac.update(message).digest('base64url');
}
