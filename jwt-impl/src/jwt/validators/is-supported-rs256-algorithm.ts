import { SupportedRsaAlgorithm } from '../models/supported-signature-algorithm';

export function isSupportedRsaAlgorithm(v: any): v is SupportedRsaAlgorithm {
  return (
    typeof v === 'string' &&
    SupportedRsaAlgorithm.findIndex((e) => e === v) !== -1
  );
}
