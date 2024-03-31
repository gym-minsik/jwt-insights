import { isString } from './is-string';

export function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every(isString);
}
