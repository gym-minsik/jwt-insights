import { createSecretKey, KeyObject } from 'crypto';
import { InvalidSecretKeyException } from '../exceptions/invalid-secret-key.exception';
import { isString } from '../../global/validators/is-string';

export class SecretKey {
  private readonly secretKeyObject: KeyObject;

  constructor(key: string | Buffer) {
    if (isString(key)) {
      key = Buffer.from(key);
    }

    try {
      this.secretKeyObject = createSecretKey(key);
    } catch (e) {
      throw new InvalidSecretKeyException();
    }
  }

  get keyObject() {
    return this.secretKeyObject;
  }
}
