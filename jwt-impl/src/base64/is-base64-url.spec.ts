import { isBase64Url } from './is-base64-url';

describe('isBase64Url', () => {
  it('should return true for a valid Base64URL encoded string without padding', () => {
    const validBase64Url = 'SGVsbG9Xb3JsZA'; // 'HelloWorld' in Base64URL
    expect(isBase64Url(validBase64Url)).toBe(true);
  });

  it('should return true for a valid Base64URL encoded string with one padding character', () => {
    const validBase64UrlWithPadding = 'SGVsbG9Xb3JsZA='; // Padding added
    expect(isBase64Url(validBase64UrlWithPadding)).toBe(true);
  });

  it('should return true for a valid Base64URL encoded string with two padding characters', () => {
    const validBase64UrlWithTwoPaddings = 'SGVsbG9Xb3JsZD=='; // Two paddings
    expect(isBase64Url(validBase64UrlWithTwoPaddings)).toBe(true);
  });

  it('should return false for a string with non-Base64URL characters', () => {
    const invalidBase64Url = 'SGVsbG9+X29y|ZA=='; // '+' and '|' are not allowed
    expect(isBase64Url(invalidBase64Url)).toBe(false);
  });

  it('should return false for a string with more than two padding characters', () => {
    const invalidPadding = 'SGVsbG9Xb3JsZA===';
    expect(isBase64Url(invalidPadding)).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isBase64Url('')).toBe(false);
  });

  it('should ignore leading and trailing whitespace', () => {
    const validBase64Url = '  SGVsbG9Xb3JsZA==  ';
    expect(isBase64Url(validBase64Url)).toBe(true);
  });
});
