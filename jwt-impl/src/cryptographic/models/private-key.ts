import { createPrivateKey, KeyObject } from 'crypto';
import { InvalidPrivateKeyException } from '../exceptions/invalid-private-key.exception';

export class PrivateKey {
  private readonly privateKeyObject: KeyObject;

  constructor(key: string | Buffer) {
    try {
      this.privateKeyObject = createPrivateKey(key);
    } catch (e) {
      throw new InvalidPrivateKeyException();
    }
  }

  get keyObject() {
    return this.privateKeyObject;
  }
}
