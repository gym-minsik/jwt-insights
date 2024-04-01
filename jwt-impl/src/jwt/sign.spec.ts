import { SupportedSignatureAlgorithm } from '../cryptographic/models/supported-signature-algorithm';
import { sign } from './sign';
import { Duration } from '../global/models/duration';
import { NumericDate } from '../global/models/numeric-date';
import { Audience, JwtId, Subject } from './models/registered-claims';
import crypto from 'crypto';
import { SecretKey } from '../cryptographic/models/secret-key';
import { PrivateKey } from '../cryptographic/models/private-key';
import { PublicKey } from '../cryptographic/models/public-key';
import { decodeBase64Url } from '../base64/decode-base64-url';
import { isBase64Url } from '../base64/is-base64-url';

describe('sign', () => {
  const fakeSecretKey = new SecretKey('fake-secret-key');
  // Simple RSA key pair for testing purposes.
  // In a real application, you'd use securely stored keys.
  const result = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  const [fakePrivateKey, fakePublicKey] = [
    new PrivateKey(result.privateKey),
    new PublicKey(result.publicKey),
  ];

  describe('basic', () => {
    it('should throw an Error when non-positive activeAfter was passed.', () => {
      for (let i = 0; -10 < i; i--) {
        expect(() =>
          sign({
            customClaims: {},
            key: fakeSecretKey,
            algorithm: 'HS256',
            activeAfter: new Duration({ minutes: i }),
          })
        ).toThrow();
      }
    });

    it('should throw an Error when non-positive expiresIn was passed.', () => {
      for (let i = 0; -10 < i; i--) {
        expect(() =>
          sign({
            customClaims: {},
            key: fakeSecretKey,
            algorithm: 'HS256',
            expiresIn: new Duration({ minutes: i }),
          })
        ).toThrow();
      }
    });
  });

  describe('with HS256', () => {
    it('should correctly create a token.', () => {
      const alg: SupportedSignatureAlgorithm = 'HS256';

      const now = NumericDate.now();
      const customClaims = Object.freeze({
        type: 'ACCESS_TOKEN',
      });
      const fiveMinutes = new Duration({ minutes: 5 });
      const tenMinutes = new Duration({ minutes: 10 });
      const subject: Subject = 'fake-user-id';
      const audience: Audience = 'ALL';
      const jwtId: JwtId = 'fake-jwt-id';

      jest.useFakeTimers().setSystemTime(now.toDate());
      const result = sign({
        customClaims: customClaims,
        key: fakeSecretKey,
        algorithm: alg,
        activeAfter: tenMinutes,
        expiresIn: fiveMinutes,
        subject,
        audience,
        jwtId,
      });
      expect(result.token.split('.').length).toBe(3);
      expect(result.header).toStrictEqual({
        alg: alg,
        typ: 'JWT',
      });
      expect(result.payload).toStrictEqual({
        ...customClaims,
        exp: now.add(fiveMinutes).secondsSinceEpoch,
        sub: subject,
        aud: audience,
        nbf: now.add(tenMinutes).secondsSinceEpoch,
        jti: jwtId,
        iat: now.secondsSinceEpoch,
      });
    });
  });
  describe('with RS256', () => {
    it('should correctly create a token.', () => {
      const alg: SupportedSignatureAlgorithm = 'RS256';

      const now = NumericDate.now();
      const customClaims = Object.freeze({
        type: 'ACCESS_TOKEN',
      });
      const fiveMinutes = new Duration({ minutes: 5 });
      const tenMinutes = new Duration({ minutes: 10 });
      const subject: Subject = 'fake-user-id';
      const audience: Audience = 'ALL';

      // expected data
      const expectedHeader = {
        alg: alg,
        typ: 'JWT',
      };
      const expectedPayload = {
        ...customClaims,
        exp: now.add(fiveMinutes).secondsSinceEpoch,
        sub: subject,
        aud: audience,
        nbf: now.add(tenMinutes).secondsSinceEpoch,
        iat: now.secondsSinceEpoch,
      };

      jest.useFakeTimers().setSystemTime(now.toDate());
      const result = sign({
        customClaims: customClaims,
        key: fakePrivateKey,
        algorithm: alg,
        activeAfter: tenMinutes,
        expiresIn: fiveMinutes,
        subject,
        audience,
      });
      const jwtParts = result.token.split('.');
      expect(jwtParts.length).toBe(3);
      expect(jwtParts.every(isBase64Url));
      expect(JSON.parse(decodeBase64Url(jwtParts[0]))).toStrictEqual(
        expectedHeader
      );
      expect(JSON.parse(decodeBase64Url(jwtParts[1]))).toStrictEqual(
        expectedPayload
      );
      expect(result.header).toStrictEqual(expectedHeader);
      expect(result.payload).toStrictEqual(expectedPayload);
    });
  });
});
