export class InvalidJwtFormatException extends Error {
  constructor(readonly token: string) {
    super(`Invalid JWT format: ${token}`);
  }
}
