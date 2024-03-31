import { SupportedSignatureAlgorithm } from './supported-signature-algorithm';

export interface JwtHeader {
  alg: SupportedSignatureAlgorithm;
  typ: 'JWT';
}
