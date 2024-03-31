/**
 * Encodes a given object into a Base64URL string.
 *
 * @param target The object to be encoded.
 * @returns The Base64URL encoded string.
 *
 * @throws {Error} Throws an error if the target object is null.
 */
export function encodeBase64Url(target: object) {
  const str = JSON.stringify(target);

  return Buffer.from(str, 'utf8').toString('base64url');
}
