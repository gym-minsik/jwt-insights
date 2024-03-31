import { isString } from '../../global/validators/is-string';
import { RegisteredClaims } from '../models/registered-claims';

export function isRegisteredClaims(input: any): input is RegisteredClaims {
  if (typeof input !== 'object' || input === null) {
    return false;
  }

  if (input.iss !== undefined && !isString(input.iss)) {
    return false;
  }

  if (input.sub !== undefined && !isString(input.sub)) {
    return false;
  }

  if (input.aud !== undefined && !isString(input.aud)) {
    return false;
  }
  if (input.exp !== undefined && !Number.isInteger(input.exp)) {
    return false;
  }

  if (input.nbf !== undefined && !Number.isInteger(input.nbf)) {
    return false;
  }

  if (input.iat !== undefined && !Number.isInteger(input.iat)) {
    return false;
  }

  if (input.jti !== undefined && !isString(input.jti)) {
    return false;
  }

  return true;
}
