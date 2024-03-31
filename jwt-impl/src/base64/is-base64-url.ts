/**
 * Checks if a given string is a valid Base64URL encoded string.
 *
 * Base64URL is a URL-safe variant of Base64 encoding, designed to eliminate
 * the need for URL encoding.
 *
 * In Base64URL, the '+' and '/' characters of standard
 * Base64 are replaced with '-' and '_', respectively, to make the encoded data
 * safe for use in URLs and filenames. Padding with '=' characters is allowed but not required.
 *
 * This function tests a string against a regular expression that validates
 * the Base64URL format: characters must be alphanumeric, '-', or '_', optionally followed
 * by up to two '=' padding characters. The input string is first trimmed of whitespace
 * before validation.
 *
 * @param {string} str - The string to be checked for Base64URL encoding.
 * @returns {boolean} `true` if the string is a valid Base64URL encoded string; `false` otherwise.
 */
export function isBase64Url(str: string): boolean {
  const base64UrlRegex = /^[A-Za-z0-9_-]+={0,2}$/;
  str = str.trim();
  return str.length > 0 && base64UrlRegex.test(str);
}
