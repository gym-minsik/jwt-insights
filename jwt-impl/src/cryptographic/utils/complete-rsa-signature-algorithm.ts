import { SupportedRsaAlgorithm } from '../models/supported-signature-algorithm';

export function completeRsaSignatureAlgorithm(
  algorithm: SupportedRsaAlgorithm
): string {
  switch (algorithm) {
    case 'RS256':
      return 'RSA-SHA256';
  }
}
