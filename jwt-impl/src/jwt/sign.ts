import { encodeBase64Url } from '../base64/encode-base64-url';
import { createSignatureMessage } from './utils/create-signature-message';
import {
  Audience,
  ExpirationDate,
  JwtId,
  NotBefore,
  RegisteredClaims,
  Subject,
} from './models/registered-claims';

import { ValidCustomClaims } from './models/valid-custom-claim-object';
import { Duration } from '../global/models/duration';
import {
  SupportedHmacAlgorithm,
  SupportedSignatureAlgorithm,
} from '../cryptographic/models/supported-signature-algorithm';
import { NumericDate } from '../global/models/numeric-date';
import { JwtHeader } from './models/jwt-header';
import { SecretKey } from '../cryptographic/models/secret-key';
import { PrivateKey } from '../cryptographic/models/private-key';
import { generateRsaSignature } from '../cryptographic/generate-rsa-signature';
import { createJwt } from './utils/create-jwt';
import { isSupportedHmacAlgorithm } from './validators/is-supported-hmac-algorithm';
import { generateHmacSignature } from '../cryptographic/generate-hmac-signature';

/**
 * Signs and generates a JSON Web Token (JWT) based on the provided arguments. This function supports both HMAC-based
 * algorithms (HS*) for symmetric key encryption and RSA-based algorithms (RS*) for asymmetric key encryption.
 * It ensures the correct type of key is used for the specified algorithm, where HMAC requires a symmetric key (SecretKey)
 * and RSA requires an asymmetric key (PrivateKey). Attempting to use an incorrect key type results in a compile-time error,
 * enforced by the TypeScript type system, unless bypassed using `any`.
 *
 * @param args - An object containing the necessary parameters to create the JWT, including:
 *  - `customClaims`: Optional. Custom claims to include in the payload of the JWT. The `customClaims` should be an object
 *    that does not contain any standard JWT registered claim names (iss, sub, aud, exp, nbf, iat, jti). Attempting to use
 *    any of these reserved names will result in a compile-time error. This enforcement ensures the separation of custom
 *    claims from the standard JWT claims, adhering to the JWT specification.
 *  - `algorithm`: The algorithm to use for signing the JWT. This also dictates the type of key required.
 *  - `key`: The key used for signing. Depending on the algorithm, this should be either a symmetric secret key
 *    for HMAC algorithms or a private key for RSA algorithms.
 *  - `subject`: Optional. The subject claim identifies the principal that is the subject of the JWT.
 *  - `audience`: Optional. The audience claim identifies the recipients that the JWT is intended for.
 *  - `expiresIn`: Optional. The duration from the current time after which the JWT should expire.
 *  - `activeAfter`: Optional. The duration from the current time before which the JWT should not be accepted.
 *  - `jwtId`: Optional. Provides a unique identifier for the JWT.
 */
export function sign<C, A extends SupportedSignatureAlgorithm>(
  args: Readonly<{
    customClaims?: ValidCustomClaims<C>;
    algorithm: A;
    key: A extends SupportedHmacAlgorithm ? SecretKey : PrivateKey;
    subject?: Subject;
    audience?: Subject;
    expiresIn?: Duration;
    activeAfter?: Duration;
    jwtId?: JwtId;
  }>
) {
  const {
    customClaims,
    algorithm,
    key,
    subject,
    audience,
    expiresIn,
    activeAfter,
    jwtId,
  } = args;

  const header: Readonly<JwtHeader> = {
    alg: completeAlgorithm(algorithm),
    typ: 'JWT',
  };

  const payload: typeof customClaims extends undefined
    ? RegisteredClaims
    : RegisteredClaims & C = {
    ...completeSubject(subject),
    ...completeAudience(audience),
    ...completeExpirationDate(expiresIn),
    ...completeNotBefore(activeAfter),
    ...completeIssuedAt(),
    ...completeJwtId(jwtId),
    ...completeCustomClaims(customClaims),
  };

  const encodedHeader = encodeBase64Url(header);
  const encodedPayload = encodeBase64Url(payload);
  let encodedSignature: string | null = null;

  if (isSupportedHmacAlgorithm(header.alg)) {
    encodedSignature = generateHmacSignature(
      createSignatureMessage(encodedHeader, encodedPayload),
      // It is guaranteed to match the expected type Secret Key, as the algorithm dictates the key type.
      // Casting to `any` is the only way to bypass this type restriction.
      key as SecretKey,
      header.alg
    );
  } else {
    encodedSignature = generateRsaSignature(
      createSignatureMessage(encodedHeader, encodedPayload),
      // It is guaranteed to match the expected type Private Key, as the algorithm dictates the key type.
      // Casting to `any` is the only way to bypass this type restriction.
      key as PrivateKey,
      header.alg
    );
  }

  return {
    token: createJwt(encodedHeader, encodedPayload, encodedSignature),
    header,
    payload,
  };
}

function completeCustomClaims<C>(
  customClaims: ValidCustomClaims<C> | undefined
): ValidCustomClaims<C> {
  return customClaims || <ValidCustomClaims<C>>{};
}

function completeAlgorithm(
  alg?: SupportedSignatureAlgorithm
): SupportedSignatureAlgorithm {
  if (!alg) return 'HS256';
  return alg;
}

function completeSubject(subject?: Subject): {
  sub?: Subject;
} {
  if (!subject) return {} as const;

  return { sub: subject } as const;
}

function completeAudience(audience?: Audience): {
  aud?: Audience;
} {
  if (!audience) return {} as const;

  return { aud: audience } as const;
}

function completeExpirationDate(expiresIn?: Duration): {
  exp?: ExpirationDate;
} {
  if (!expiresIn) return {} as const;

  if (expiresIn.inSeconds <= 0) {
    throw new Error(
      `The expiresIn must be a positive number of seconds: ${expiresIn.inSeconds}`
    );
  }

  return { exp: NumericDate.now().add(expiresIn).secondsSinceEpoch } as const;
}

function completeNotBefore(activeAfter?: Duration): {
  nbf?: NotBefore;
} {
  if (!activeAfter) return {} as const;

  if (activeAfter.inSeconds <= 0) {
    throw new Error(
      `The activeAter must be a positive number of seconds: ${activeAfter.inSeconds}`
    );
  }

  return { nbf: NumericDate.now().add(activeAfter).secondsSinceEpoch } as const;
}

function completeIssuedAt() {
  return { iat: NumericDate.now().secondsSinceEpoch } as const;
}

function completeJwtId(jwtId?: JwtId) {
  if (!jwtId) return {} as const;
  return { jti: jwtId } as const;
}
