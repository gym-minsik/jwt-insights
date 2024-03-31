export function createSignatureMessage(
  encodedHeader: string,
  encodedPayload: string
) {
  return `${encodedHeader}.${encodedPayload}`;
}
