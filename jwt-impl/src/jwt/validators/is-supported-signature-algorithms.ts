import { SupportedSignatureAlgorithm } from '../../cryptographic/models/supported-signature-algorithm';

export function isSupportedSignatureAlgorithm(
  val: unknown
): val is SupportedSignatureAlgorithm {
  if (typeof val !== 'string') return false;

  return SupportedSignatureAlgorithm.findIndex((e) => e === val) !== -1;
}
