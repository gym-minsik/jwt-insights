export interface RegisteredClaims {
  iss?: Issuer;
  sub?: Subject;
  aud?: Audience;
  exp?: ExpirationDate;
  nbf?: NotBefore;
  iat?: IssuedAt;
  jti?: JwtId;
}

export type Issuer = string;
export type Subject = string;
export type Audience = string;
export type ExpirationDate = number;
export type NotBefore = number;
export type IssuedAt = number;
export type JwtId = string;
