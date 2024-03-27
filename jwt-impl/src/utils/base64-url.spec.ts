import { isBase64Url, encodeBase64Url, decodeBase64Url } from './base64-url'; // Adjust the import path

describe('Base64 URL Functions', () => {
  describe('isBase64Url', () => {
    it('returns true for valid Base64Url encoded strings', () => {
      expect(isBase64Url('SGVsbG8tV29ybGQ')).toBe(true); // "Hello-World" in Base64Url
      expect(isBase64Url('SGVsbG8tV29ybGRfLT0=')).toBe(true);
    });

    it('returns false for invalid Base64Url encoded strings', () => {
      expect(isBase64Url('Hello World')).toBe(false); // Not Base64Url
      expect(isBase64Url('SGVsbG8/V29ybGQ=')).toBe(false); // Contains characters not allowed in Base64Url
    });

    it('returns false for empty or whitespace-only strings', () => {
      expect(isBase64Url('')).toBe(false);
      expect(isBase64Url('   ')).toBe(false);
    });
  });

  describe('encodeBase64Url', () => {
    it('correctly encodes an object to a Base64Url string', () => {
      const target = { hello: 'world' };
      const encoded = encodeBase64Url(target);
      expect(isBase64Url(encoded)).toBe(true);
      // Specific encoding result might vary, check against known value if deterministic
    });
  });

  describe('decodeBase64Url', () => {
    it('correctly decodes a Base64Url string to the original string', () => {
      const originalObject = { hello: 'world' };
      const encoded = encodeBase64Url(originalObject);
      expect(decodeBase64Url(encoded)).toStrictEqual(
        JSON.stringify(originalObject)
      );
    });
  });

  describe('Encoding and Decoding Integration', () => {
    it('should encode and then decode back to the original object', () => {
      const originalObject = { test: 'value', key: 'data' };
      const encoded = encodeBase64Url(originalObject);
      const decoded = decodeBase64Url(encoded);
      expect(JSON.parse(decoded)).toStrictEqual(originalObject);
    });
  });
});
