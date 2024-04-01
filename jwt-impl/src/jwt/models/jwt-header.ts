import { SupportedSignatureAlgorithm } from '../../cryptographic/models/supported-signature-algorithm';

export interface JwtHeader {
  alg: SupportedSignatureAlgorithm;
  typ: 'JWT';
}
