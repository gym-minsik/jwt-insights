import { JwtHeader } from '../models/jwt-header';
import { isSupportedSignatureAlgorithm } from './is-supported-signature-algorithms';

export function isJwtHeader(v: any): v is JwtHeader {
  if (typeof v !== 'object') return false;

  return (
    typeof v === 'object' &&
    v !== null &&
    isSupportedSignatureAlgorithm(v.alg) &&
    v.typ === 'JWT'
  );
}
