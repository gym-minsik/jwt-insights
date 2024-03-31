export class InvalidPrivateKeyException extends Error {
  constructor(public readonly key?: string | Buffer) {
    super('The provided key is not a private key.');
  }
}
