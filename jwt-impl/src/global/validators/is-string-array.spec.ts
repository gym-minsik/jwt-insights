import { isStringArray } from './is-string-array';
import { isString } from './is-string'; // Assuming isString is in a separate file

describe('isStringArray', () => {
  it('returns true for an array of string primitives', () => {
    expect(isStringArray(['hello', 'world'])).toBe(true);
  });

  it('returns true for an empty array', () => {
    expect(isStringArray([])).toBe(true); // Depending on your use case, you might expect this to be true or false.
  });

  it('returns false for an array containing a mix of strings and non-strings', () => {
    expect(isStringArray(['hello', 42, 'world'])).toBe(false);
  });

  it('returns false for an array of non-string values', () => {
    expect(isStringArray([1, 2, 3])).toBe(false);
    expect(isStringArray([{}, [], true, undefined])).toBe(false);
  });

  it('returns true for an array of String objects', () => {
    expect(isStringArray([new String('hello'), new String('world'), '!'])).toBe(
      true
    );
  });

  it('returns false for non-array values', () => {
    expect(isStringArray('not an array')).toBe(false);
    expect(isStringArray({})).toBe(false);
    expect(isStringArray(undefined)).toBe(false);
    expect(isStringArray(null)).toBe(false);
    expect(isStringArray(42)).toBe(false);
  });
});
