import { isString } from './is-string'; // Adjust the import path based on your project structure

describe('isString', () => {
  it('returns true for plain strings', () => {
    expect(isString('hello')).toBe(true);
    expect(isString('')).toBe(true);
  });

  it('returns true for String objects', () => {
    expect(isString(new String('hello'))).toBe(true);
  });

  it('returns false for numbers', () => {
    expect(isString(123)).toBe(false);
    expect(isString(-123)).toBe(false);
    expect(isString(0)).toBe(false);
  });

  it('returns false for boolean values', () => {
    expect(isString(true)).toBe(false);
    expect(isString(false)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isString(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isString(undefined)).toBe(false);
  });

  it('returns false for objects', () => {
    expect(isString({})).toBe(false);
    expect(isString({ a: 1 })).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isString([])).toBe(false);
    expect(isString(['hello'])).toBe(false);
  });

  it('returns false for functions', () => {
    expect(isString(() => {})).toBe(false);
  });

  it('returns false for symbols', () => {
    expect(isString(Symbol('sym'))).toBe(false);
  });
});
