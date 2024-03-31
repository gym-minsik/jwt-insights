import {
  SupportedHmacAlgorithm,
  SupportedRsaAlgorithm,
} from '../models/supported-signature-algorithm';
import { isSupportedHmacAlgorithm } from './is-supported-hmac-algorithm';

describe('isSupportedHmacAlgorithm', () => {
  it('should return true for a supported HMAC algorithm.', () => {
    for (const alg of SupportedHmacAlgorithm) {
      expect(isSupportedHmacAlgorithm(alg)).toBe(true);
    }
  });

  it('should return false for unsupported HMAC algorithm.', () => {
    for (const alg of SupportedRsaAlgorithm) {
      expect(isSupportedHmacAlgorithm(alg)).toBe(false);
    }
  });

  it('should return false for a non-string input', () => {
    expect(isSupportedHmacAlgorithm(123)).toBe(false); // Numeric input
    expect(isSupportedHmacAlgorithm({})).toBe(false); // Object input
    expect(isSupportedHmacAlgorithm(null)).toBe(false); // null
    expect(isSupportedHmacAlgorithm(undefined)).toBe(false); // undefined
  });

  it('should return false for an empty string', () => {
    expect(isSupportedHmacAlgorithm('')).toBe(false);
  });
});
