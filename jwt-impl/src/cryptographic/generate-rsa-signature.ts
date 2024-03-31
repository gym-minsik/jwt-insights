import { SupportedRsaAlgorithm } from '../jwt/models/supported-signature-algorithm';
import { PrivateKey } from './models/private-key';
import crypto, { createSign } from 'crypto';
import { completeRsaSignatureAlgorithm } from './utils/complete-rsa-signature-algorithm';

export function generateRsaSignature(
  message: string,
  privateKey: PrivateKey,
  algorithm: SupportedRsaAlgorithm
) {
  const sign: crypto.Sign = createSign(
    completeRsaSignatureAlgorithm(algorithm)
  );

  return sign.update(message).sign(privateKey.keyObject, 'base64url');
}
