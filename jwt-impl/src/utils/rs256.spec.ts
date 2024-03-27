import { signRS256, verifyRS256 } from './rs256';
import crypto from 'crypto';

describe('RSA-SHA256 Signing and Verification', () => {
  // Simple RSA key pair for testing purposes.
  // In a real application, you'd use securely stored keys.
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
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

  const message = 'Hello, RSA-SHA256!';

  it('should sign a message correctly with RS256', () => {
    const signature = signRS256(message, privateKey);
    expect(typeof signature).toBe('string');
  });

  it('should verify a correctly signed message with RS256', () => {
    const signature = signRS256(message, privateKey);
    const isValid = verifyRS256(message, signature, publicKey);
    expect(isValid).toBe(true);
  });

  it('should not verify a message with an incorrect signature', () => {
    const wrongSignature = signRS256('Wrong message', privateKey);
    const isValid = verifyRS256(message, wrongSignature, publicKey);
    expect(isValid).toBe(false);
  });

  it('should not verify a message with an incorrect public key', () => {
    const signature = signRS256(message, privateKey);
    const { publicKey: wrongPublicKey } = crypto.generateKeyPairSync('rsa', {
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
    const isValid = verifyRS256(message, signature, wrongPublicKey);
    expect(isValid).toBe(false);
  });
});
