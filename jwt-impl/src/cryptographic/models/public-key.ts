import { createPublicKey, KeyObject } from 'crypto';
import { InvalidPublicKeyException } from '../exceptions/invalid-public-key.exception';

export class PublicKey {
  private readonly publicKeyObject: KeyObject;

  constructor(key: string | Buffer) {
    try {
      this.publicKeyObject = createPublicKey(key);
    } catch (e) {
      throw new InvalidPublicKeyException();
    }
  }

  get keyObject() {
    return this.publicKeyObject;
  }
}
