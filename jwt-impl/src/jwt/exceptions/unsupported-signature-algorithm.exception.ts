import { SupportedSignatureAlgorithm } from '../models/supported-signature-algorithm';

export class UnsupportedSignatureAlgorithmException extends Error {
  constructor(public readonly algorithm: string) {
    super(
      `Unsupported signature algorithm(${algorithm}) is provided. ` +
        `The supported signature algorithm are ${SupportedSignatureAlgorithm.join(
          ', '
        )}`
    );
  }
}
