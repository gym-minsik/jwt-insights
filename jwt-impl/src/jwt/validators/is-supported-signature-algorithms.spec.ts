import { SupportedSignatureAlgorithm } from '../models/supported-signature-algorithm';
import { isSupportedSignatureAlgorithm } from './is-supported-signature-algorithms';

describe('isSupportedSignatureAlgorithm', () => {
  it('should return true for a supported signature algorithm', () => {
    // Testing with a subset of common algorithms, assuming these are supported
    for (const alg of SupportedSignatureAlgorithm) {
      expect(isSupportedSignatureAlgorithm(alg)).toBe(true);
    }
  });

  it('should return false for an unsupported signature algorithm', () => {
    // An example of an algorithm that is not supported or doesn't exist
    expect(isSupportedSignatureAlgorithm('HS1024')).toBe(false);
  });

  it('should return false for non-string inputs', () => {
    // Various types of inputs that are not strings
    expect(isSupportedSignatureAlgorithm(256)).toBe(false);
    expect(isSupportedSignatureAlgorithm({})).toBe(false);
    expect(isSupportedSignatureAlgorithm([])).toBe(false);
    expect(isSupportedSignatureAlgorithm(null)).toBe(false);
    expect(isSupportedSignatureAlgorithm(undefined)).toBe(false);
  });

  it('should return false for an empty string', () => {
    // Empty string is not a valid algorithm
    expect(isSupportedSignatureAlgorithm('')).toBe(false);
  });
});
