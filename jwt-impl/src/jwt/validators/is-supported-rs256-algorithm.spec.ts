import {
  SupportedHmacAlgorithm,
  SupportedRsaAlgorithm,
} from '../models/supported-signature-algorithm';
import { isSupportedRsaAlgorithm } from './is-supported-rs256-algorithm';

describe('isSupportedRsaAlgorithm', () => {
  it('should return true for a supported HMAC algorithm.', () => {
    for (const alg of SupportedRsaAlgorithm) {
      expect(isSupportedRsaAlgorithm(alg)).toBe(true);
    }
  });

  it('should return false for unsupported HMAC algorithm.', () => {
    for (const alg of SupportedHmacAlgorithm) {
      expect(isSupportedRsaAlgorithm(alg)).toBe(false);
    }
  });

  it('should return false for a non-string input', () => {
    expect(isSupportedRsaAlgorithm(123)).toBe(false); // Numeric input
    expect(isSupportedRsaAlgorithm({})).toBe(false); // Object input
    expect(isSupportedRsaAlgorithm(null)).toBe(false); // null
    expect(isSupportedRsaAlgorithm(undefined)).toBe(false); // undefined
  });

  it('should return false for an empty string', () => {
    expect(isSupportedRsaAlgorithm('')).toBe(false);
  });
});
