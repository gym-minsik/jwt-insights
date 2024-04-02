import { PrimitiveType } from '../../global/models/primitive-type';
import { RegisteredClaims } from './registered-claims';

/**
 * Represents a valid custom claims object for JWT (JSON Web Token) that excludes standard JWT registered claims.
 *
 * This type ensures that the custom claims object does not inadvertently contain any JWT registered claim names,
 * such as 'iss' (Issuer), 'sub' (Subject), 'aud' (Audience), 'exp' (Expiration Time), 'nbf' (Not Before),
 * 'iat' (Issued At), and 'jti' (JWT ID). These registered claim names are reserved for specific purposes in JWTs
 * and should not be overridden by custom claims.
 *
 * The `ValidCustomClaimObject<T>` type uses TypeScript's conditional types to filter out any type `T` that includes
 * properties with these reserved names. If `T` contains any of these properties, the type resolves to `never`,
 * effectively preventing the type from being used in contexts where custom claims are expected.
 *
 * Usage:
 * To use this type, simply define your custom claims object and apply the `ValidCustomClaimObject` type. If the object
 * contains any of the registered claims, TypeScript will raise a compile-time error.
 *
 * Example:
 * ```typescript
 * interface MyCustomClaims {
 *   userId: number;
 *   organization: string;
 * }
 *
 * const myClaims: ValidCustomClaimObject<MyCustomClaims> = {
 *   userId: 123,
 *   organization: 'Acme Corp'
 * };
 * ```
 *
 * In this example, `MyCustomClaims` does not contain any JWT registered claim names, so it is considered a valid
 * type for `ValidCustomClaimObject<T>`. Attempting to include any registered claim names in `MyCustomClaims` would
 * result in a compile-time error.
 *
 * Note:
 * This type is designed to be used in environments where strict adherence to the JWT specification is required,
 * and custom claims need to be clearly distinguished from registered claims.
 */
export type ValidCustomClaims<T> = T extends PrimitiveType
  ? never
  : T extends { iss: any }
  ? never
  : T extends { sub: any }
  ? never
  : T extends { aud: any }
  ? never
  : T extends { exp: any }
  ? never
  : T extends { nbf: any }
  ? never
  : T extends { iat: any }
  ? never
  : T extends { jti: any }
  ? never
  : OnlyStringKeys<T>;

type OnlyStringKeys<T> = {
  [K in keyof T]: K extends string ? T[K] : never;
};
