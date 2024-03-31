import { createPrivateKey, generateKeyPairSync } from 'crypto';
import { InvalidPrivateKeyException } from '../exceptions/invalid-private-key.exception';
import { PrivateKey } from './private-key';
import crypto from 'crypto';

describe('PrivateKey', () => {
  // Example of a valid PEM-formatted private key (simplified for this example)
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

  it('should correctly initialize with a valid key string', () => {
    // Setup the mock to return a fake KeyObject when a valid key is provided

    const privateKey = new PrivateKey(result.privateKey);
    expect(privateKey.keyObject).toEqual(
      createPrivateKey(Buffer.from(result.privateKey))
    );
  });

  it('should throw InvalidPrivateKeyException for an invalid key', () => {
    // Setup the mock to throw an error when an invalid key is provided

    expect(() => new PrivateKey('invalid-key')).toThrow(
      InvalidPrivateKeyException
    );
  });
});
