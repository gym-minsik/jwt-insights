import { InvalidJwtFormatException } from './exceptions/invalid-jwt-format.exception';
import {
  SupportedHmacAlgorithm,
  SupportedSignatureAlgorithm,
} from '../cryptographic/models/supported-signature-algorithm';
import { isJwtHeader } from './validators/is-jwt-header';
import { SecretKey } from '../cryptographic/models/secret-key';
import { PublicKey } from '../cryptographic/models/public-key';
import { Audience, JwtId, Subject } from './models/registered-claims';
import { NumericDate } from '../global/models/numeric-date';
import { createSignatureMessage } from './utils/create-signature-message';
import { isRegisteredClaims } from './validators/is-registered-claims';
import { isSupportedHmacAlgorithm } from './validators/is-supported-hmac-algorithm';
import { VerifiedJwtPayload } from './models/verified-jwt-payload';
import { verifyRsaSignature } from '../cryptographic/verify-rsa-signature';
import { verifyHmacSignature } from '../cryptographic/verify-hmac-signature';
import { isBase64Url } from '../base64/is-base64-url';
import { decodeBase64Url } from '../base64/decode-base64-url';

export function verify<A extends SupportedSignatureAlgorithm>(
  args: Readonly<{
    token: string;
    algorithm: A;
    key: A extends SupportedHmacAlgorithm ? SecretKey : PublicKey;
    allowedAudiences?: Audience[];
    allowedSubjects?: Subject[];
    allowedJwtIds?: JwtId[];
  }>
) {
  const now = NumericDate.now();
  const token = args.token;
  const key = args.key;
  const allowedAudiences = args.allowedAudiences;
  const allowedJwtIds = args.allowedJwtIds;
  const allowedSubjects = args.allowedSubjects;
  const algorithm = args.algorithm;

  const parts = args.token.split('.');
  if (parts.length !== 3 || !parts.every(isBase64Url)) {
    throw new InvalidJwtFormatException(token);
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = JSON.parse(decodeBase64Url(encodedHeader));

  if (!isJwtHeader(header)) {
    throw new Error(
      'Invalid JWT header: Header does not conform to JWT standards.'
    );
  }
  if (header.alg !== algorithm) {
    throw new Error(
      `Algorithm mismatch: Expected ${algorithm}, but got ${header.alg} in the JWT Header.`
    );
  }

  let isSignatureVerified = false;
  if (isSupportedHmacAlgorithm(algorithm)) {
    if (key instanceof PublicKey) {
      throw new Error(
        'Key type error: HMAC algorithm expects a SecretKey, but a PublicKey was provided.'
      );
    }
    isSignatureVerified = verifyHmacSignature(
      createSignatureMessage(encodedHeader, encodedPayload),
      encodedSignature,
      key,
      algorithm
    );
  } else {
    if (key instanceof SecretKey) {
      throw new Error(
        'Key type error: RSA algorithm expects a PublicKey, but a SecretKey was provided.'
      );
    }
    isSignatureVerified = verifyRsaSignature(
      createSignatureMessage(encodedHeader, encodedPayload),
      encodedSignature,
      key,
      algorithm
    );
  }

  if (!isSignatureVerified) {
    throw new Error('Signature verification failed: The signature is invalid.');
  }

  const decodedPayload = JSON.parse(decodeBase64Url(encodedPayload));

  if (!isRegisteredClaims(decodedPayload)) {
    throw new Error(
      'Invalid JWT payload: Payload does not conform to registered claim specifications.'
    );
  }

  if (
    decodedPayload.exp &&
    now.isAfterOrEqual(new NumericDate(decodedPayload.exp))
  ) {
    throw new Error(`JWT expired: The token's expiry time has passed.`);
  }

  if (decodedPayload.nbf && now.isBefore(new NumericDate(decodedPayload.nbf))) {
    throw new Error(
      "JWT not yet valid: The token's not-before time has not yet been reached."
    );
  }

  if (allowedAudiences) {
    if (!decodedPayload.aud || !allowedAudiences.includes(decodedPayload.aud)) {
      throw new Error(
        'Audience not allowed: The token’s audience is not in the list of allowed audiences.'
      );
    }
  }

  if (allowedSubjects) {
    if (!decodedPayload.sub || !allowedSubjects.includes(decodedPayload.sub)) {
      throw new Error(
        'Subject not allowed: The token’s subject is not in the list of allowed subjects.'
      );
    }
  }

  if (allowedJwtIds) {
    if (!decodedPayload.jti || !allowedJwtIds.includes(decodedPayload.jti)) {
      throw new Error(
        'JWT ID not allowed: The token’s JWT ID is not in the list of allowed JWT IDs.'
      );
    }
  }

  const verifiedPayload: VerifiedJwtPayload = {
    ...decodedPayload,
  };

  return {
    header: header,
    payload: verifiedPayload,
  };
}
