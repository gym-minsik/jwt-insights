import { KeyLike, KeyObject } from 'crypto';

export class InvalidPublicKeyException extends Error {
  constructor(public readonly key?: KeyLike) {
    super('The provided key is not a public key.');
  }
}
