import { SupportedHmacAlgorithm } from '../models/supported-signature-algorithm';

export function isSupportedHmacAlgorithm(v: any): v is SupportedHmacAlgorithm {
  return (
    typeof v === 'string' &&
    SupportedHmacAlgorithm.findIndex((e) => e === v) !== -1
  );
}
