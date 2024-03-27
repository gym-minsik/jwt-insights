import { signHS256, verifyHS256 } from './hs256';

describe('HS256 Signing and Verification', () => {
  const secretKey = 'mySecretKey';
  const message = 'Hello, world!';

  it('should sign a message correctly with HS256', () => {
    const signature = signHS256(message, secretKey);
    expect(typeof signature).toBe('string');
    expect(signature).not.toEqual(message);
  });

  it('should verify a correctly signed message with HS256', () => {
    const signature = signHS256(message, secretKey);
    const isValid = verifyHS256(message, signature, secretKey);
    expect(isValid).toBe(true);
  });

  it('should not verify an incorrectly signed message or wrong secret key with HS256', () => {
    const wrongMessage = 'Goodbye, world!';
    const wrongKey = 'wrongSecretKey';
    const signature = signHS256(message, secretKey);

    const isValidWithWrongMessage = verifyHS256(
      wrongMessage,
      signature,
      secretKey
    );
    expect(isValidWithWrongMessage).toBe(false);

    const isValidWithWrongKey = verifyHS256(message, signature, wrongKey);
    expect(isValidWithWrongKey).toBe(false);
  });

  it('should produce different signatures for different messages', () => {
    const message2 = 'Another message';
    const signature1 = signHS256(message, secretKey);
    const signature2 = signHS256(message2, secretKey);

    expect(signature1).not.toEqual(signature2);
  });

  it('should produce different signatures for the same message with different keys', () => {
    const anotherSecretKey = 'anotherSecretKey';
    const signature1 = signHS256(message, secretKey);
    const signature2 = signHS256(message, anotherSecretKey);

    expect(signature1).not.toEqual(signature2);
  });
});
