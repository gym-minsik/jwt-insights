export class InvalidSecretKeyException extends Error {
  constructor(public readonly key?: string | Buffer) {
    super('The provided key is not a secret key.');
  }
}
