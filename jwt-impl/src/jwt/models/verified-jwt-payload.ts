import { RegisteredClaims } from './registered-claims';

export type VerifiedJwtPayload = RegisteredClaims & {
  [key: string]: unknown;
};
