import { decodeBase64Url } from './decode-base64-url';

describe('decodeBase64Url', () => {
  it('should decode a Base64URL encoded string to its original string', () => {
    const originalString = 'Hello World!';
    // Encode the string to Base64URL to ensure the test remains accurate regardless of the encoding process
    const base64UrlString = Buffer.from(originalString).toString('base64url');
    const decodedString = decodeBase64Url(base64UrlString);
    expect(decodedString).toBe(originalString);
  });

  it('should correctly decode strings containing special characters', () => {
    const originalString = '¡Hola, Mundo! ¿Cómo estás?';
    const base64UrlString = Buffer.from(originalString).toString('base64url');
    const decodedString = decodeBase64Url(base64UrlString);
    expect(decodedString).toBe(originalString);
  });

  it('should return an empty string when decoding an empty string', () => {
    const decodedString = decodeBase64Url('');
    expect(decodedString).toBe('');
  });
});
