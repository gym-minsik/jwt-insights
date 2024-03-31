export const SupportedHmacAlgorithm = ['HS256'] as const;
export type SupportedHmacAlgorithm = (typeof SupportedHmacAlgorithm)[number];

export const SupportedRsaAlgorithm = ['RS256'] as const;
export type SupportedRsaAlgorithm = (typeof SupportedRsaAlgorithm)[number];

export const SupportedSignatureAlgorithm = [
  ...SupportedHmacAlgorithm,
  ...SupportedRsaAlgorithm,
] as const;

export type SupportedSignatureAlgorithm =
  (typeof SupportedSignatureAlgorithm)[number];
