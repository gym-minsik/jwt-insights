import { JwtHeader } from '../models/jwt-header';
import { isJwtHeader } from './is-jwt-header';

describe('isJwtHeader', () => {
  it('should return true for a valid JwtHeader object', () => {
    const validJwtHeader: JwtHeader = { alg: 'HS256', typ: 'JWT' };
    expect(isJwtHeader(validJwtHeader)).toBeTruthy();
  });

  it('should return false if alg is not a supported signature algorithm', () => {
    const invalidAlgHeader = { alg: 'UnsupportedAlg', typ: 'JWT' };
    expect(isJwtHeader(invalidAlgHeader)).toBeFalsy();
  });

  it('should return false if typ is not "JWT"', () => {
    const invalidTypHeader = { alg: 'HS256', typ: 'NotJWT' };
    expect(isJwtHeader(invalidTypHeader)).toBeFalsy();
  });

  it('should return false for non-object inputs', () => {
    expect(isJwtHeader(null)).toBeFalsy();
    expect(isJwtHeader(undefined)).toBeFalsy();
    expect(isJwtHeader(123)).toBeFalsy();
    expect(isJwtHeader('string')).toBeFalsy();
    expect(isJwtHeader([])).toBeFalsy();
  });
});
