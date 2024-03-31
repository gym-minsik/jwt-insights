/**
 * Decodes a Base64URL encoded string back to its original string format.
 *
 * @param {string} str - The Base64URL encoded string to decode.
 * @returns {string} The decoded original string.
 */
export function decodeBase64Url(str: string) {
  return Buffer.from(str, 'base64url').toString('utf8');
}
