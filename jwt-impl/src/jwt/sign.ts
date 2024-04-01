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
import { isSupportedRsaAlgorithm } from './validators/is-supported-rs256-algorithm';
import { UnsupportedSignatureAlgorithmException } from './exceptions/unsupported-signature-algorithm.exception';

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
    ? Readonly<RegisteredClaims>
    : Readonly<RegisteredClaims> & Readonly<C> = {
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
    if (key instanceof PrivateKey) {
      throw new Error(
        'Incompatible key type: HMAC-based algorithms (HS*) require a symmetric key. ' +
          'A PrivateKey instance, which is asymmetric, was provided.' +
          ' Please use a symmetric key for HMAC algorithms.'
      );
    }
    encodedSignature = generateHmacSignature(
      createSignatureMessage(encodedHeader, encodedPayload),
      key,
      header.alg
    );
  } else {
    if (key instanceof SecretKey) {
      throw new Error(
        'Incompatible key type: RSA-based algorithms (RS*) require an asymmetric key. ' +
          'A SecretKey instance, which is symmetric, was provided. ' +
          'Please use a PublicKey for signature verification or a PrivateKey for signature generation.'
      );
    }
    encodedSignature = generateRsaSignature(
      createSignatureMessage(encodedHeader, encodedPayload),
      key,
      header.alg
    );
  }

  return {
    token: createJwt(encodedHeader, encodedPayload, encodedSignature),
    header,
    payload: payload,
  } as const;
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
