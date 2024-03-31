export function createJwt(
  encodedHeader: string,
  encodedPayload: string,
  encodedSignature: string
): `${string}.${string}.${string}` {
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}
