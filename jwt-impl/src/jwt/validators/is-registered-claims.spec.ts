import { isRegisteredClaims } from './is-registered-claims'; // Adjust the import path as necessary

describe('isRegisteredClaims', () => {
  it('should return true for a valid registered claims object', () => {
    const validClaims = {
      iss: 'issuer',
      sub: 'subject',
      aud: 'audience',
      exp: 1234567890,
      nbf: 123456789,
      iat: 123456788,
      jti: 'jwtId',
    };
    expect(isRegisteredClaims(validClaims)).toBe(true);
  });

  it('should return false for null input', () => {
    expect(isRegisteredClaims(null)).toBe(false);
  });

  it('should return false for non-object input', () => {
    expect(isRegisteredClaims('string')).toBe(false);
  });

  it('should return true for an object with no claims', () => {
    expect(isRegisteredClaims({})).toBe(true);
  });

  it('should return false if iss is not a string', () => {
    const claims = { iss: 123 };
    expect(isRegisteredClaims(claims)).toBe(false);
  });

  it('should return false if sub is not a string', () => {
    const claims = { sub: 123 };
    expect(isRegisteredClaims(claims)).toBe(false);
  });

  it('should return false if aud is not a string', () => {
    const claims = { aud: 123 };
    expect(isRegisteredClaims(claims)).toBe(false);
  });

  it('should return false if exp is not an integer', () => {
    const claims = { exp: 123.5 };
    expect(isRegisteredClaims(claims)).toBe(false);
  });

  it('should return false if nbf is not an integer', () => {
    const claims = { nbf: '213123131' };
    expect(isRegisteredClaims(claims)).toBe(false);
  });

  it('should return false if iat is not an integer', () => {
    const claims = { iat: 3.4 };
    expect(isRegisteredClaims(claims)).toBe(false);
  });

  it('should return false if jti is not a string', () => {
    const claims = { jti: 123 };
    expect(isRegisteredClaims(claims)).toBe(false);
  });
});
