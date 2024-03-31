import {
  Audience,
  Duration,
  NumericDate,
  PrivateKey,
  PublicKey,
  SecretKey,
  sign,
  Subject,
} from '../module';
import { InvalidJwtFormatException } from './exceptions/invalid-jwt-format.exception';
import { SupportedSignatureAlgorithm } from './models/supported-signature-algorithm';
import { createJwt } from './utils/create-jwt';
import { verify } from './verify';
import crypto from 'crypto';
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

describe('verify', () => {
  it(`should correctly verify the token which was signed with HS256 algorithm.`, () => {
    const signed = sign({
      algorithm: 'HS256',
      key: fakeSecretKey,
    });

    const verified = verify({
      token: signed.token,
      algorithm: 'HS256',
      key: fakeSecretKey,
    });

    expect(verified.header).toStrictEqual(signed.header);
    expect(verified.payload).toStrictEqual(signed.payload);
  });

  it(`should correctly verify the token which was signed with RS256 algorithm.`, () => {
    const signed = sign({
      algorithm: 'RS256',
      key: fakePrivateKey,
    });

    const verified = verify({
      token: signed.token,
      algorithm: 'RS256',
      key: fakePublicKey,
    });

    expect(verified.header).toStrictEqual(signed.header);
    expect(verified.payload).toStrictEqual(signed.payload);
  });

  it(`should throw ${InvalidJwtFormatException} for tokens with incorrect format.`, () => {
    const token = 'invalid.token'; // Only two parts

    expect(() =>
      verify({
        token: token,
        algorithm: 'HS256',
        key: new SecretKey('fake-secret-ky'),
      })
    ).toThrow(InvalidJwtFormatException);
  });

  it('should throw an error WHEN the algorithm does not match with the header.', () => {
    const { token } = sign({
      algorithm: 'HS256',
      key: new SecretKey('fake-secret-key'),
    });

    expect(() =>
      verify({
        token: token,
        algorithm: 'RS256',
        key: fakePublicKey,
      })
    ).toThrow();
  });

  it('should throw an error WHEN the signature is invalid.', () => {
    const { token } = sign({
      algorithm: 'HS256',
      key: new SecretKey('fake-secret-key'),
    });

    const [h, p, s] = token.split('.');

    expect(() =>
      verify({
        token: createJwt(h, p, 'invalid-signature'),
        algorithm: 'RS256',
        key: fakePublicKey,
      })
    ).toThrow();
  });

  it('should throw an error for expired token.', () => {
    const fiveMinutes = new Duration({ minutes: 5 });
    const fiveMinutesOneSeocnds = new Duration({ minutes: 5, seconds: 1 });
    const { token } = sign({
      algorithm: 'RS256',
      expiresIn: fiveMinutes,
      key: fakePrivateKey,
    });

    jest
      .useFakeTimers()
      .setSystemTime(NumericDate.now().add(fiveMinutesOneSeocnds).toDate());

    expect(() =>
      verify({
        token: token,
        algorithm: 'RS256',
        key: fakePublicKey,
      })
    ).toThrow();
  });

  it('should throw an Error for the audience is not allowed.', () => {
    const audience: Audience = 'UserService';
    const algorithm: SupportedSignatureAlgorithm = 'RS256';
    const allowedAudiences: string[] = ['PhotoService', 'ImageService'];
    const customClaims = {
      isAdmin: true,
    } as const;
    const { token } = sign({
      customClaims,
      algorithm,
      key: fakePrivateKey,
      audience,
    });

    expect(() =>
      verify({
        token: token,
        algorithm,
        key: fakePublicKey,
        allowedAudiences,
      })
    ).toThrow();
  });

  it('should throw an Error for the subject is not allowed.', () => {
    const subject = 'user-id';
    const algorithm: SupportedSignatureAlgorithm = 'RS256';
    const allowedSubjects: string[] = ['user-id-2', 'user-id-3'];
    const customClaims = {
      isAdmin: true,
    } as const;
    const { token } = sign({
      customClaims,
      algorithm,
      key: fakePrivateKey,
      subject: subject,
    });

    expect(() =>
      verify({
        token: token,
        algorithm,
        key: fakePublicKey,
        allowedSubjects: allowedSubjects,
      })
    ).toThrow();
  });

  it('should throw an Error for the jwt id is not allowed.', () => {
    const jwtId = 'jwt-id';
    const algorithm: SupportedSignatureAlgorithm = 'RS256';
    const allowedJwtIds: string[] = ['jwt-id-2', 'jwt-id-3'];
    const customClaims = {
      isAdmin: true,
    } as const;
    const { token } = sign({
      customClaims,
      algorithm,
      key: fakePrivateKey,
      jwtId: jwtId,
    });

    expect(() =>
      verify({
        token: token,
        algorithm,
        key: fakePublicKey,
        allowedJwtIds: allowedJwtIds,
      })
    ).toThrow();
  });
});
