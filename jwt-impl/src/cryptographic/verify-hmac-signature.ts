import { SupportedHmacAlgorithm } from '../jwt/models/supported-signature-algorithm';
import { generateHmacSignature } from './generate-hmac-signature';
import { SecretKey } from './models/secret-key';

export function verifyHmacSignature(
  message: string,
  encodedSignature: string,
  key: SecretKey,
  algorithm: SupportedHmacAlgorithm
) {
  return encodedSignature === generateHmacSignature(message, key, algorithm);
}
