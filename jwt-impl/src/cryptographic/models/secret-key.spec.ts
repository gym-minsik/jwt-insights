import { createPrivateKey, createSecretKey, generateKeyPairSync } from 'crypto';
import { InvalidPrivateKeyException } from '../exceptions/invalid-private-key.exception';
import { PrivateKey } from './private-key';
import crypto from 'crypto';
import { SecretKey } from './secret-key';
import { InvalidSecretKeyException } from '../exceptions/invalid-secret-key.exception';

describe('SecretKey', () => {
  // Example of a valid PEM-formatted private key (simplified for this example)
  const secretKey = 'fake-secret-key';

  it('should correctly initialize with a valid key string', () => {
    // Setup the mock to return a fake KeyObject when a valid key is provided

    const privateKey = new SecretKey(secretKey);
    expect(privateKey.keyObject).toEqual(
      createSecretKey(Buffer.from(secretKey))
    );
  });

  it('should throw InvalidPrivateKeyException for an invalid key', () => {
    expect(() => new SecretKey('')).toThrow(InvalidSecretKeyException);
  });
});
