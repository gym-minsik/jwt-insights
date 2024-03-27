import { NumericDate } from '../models/numeric-date';

/**
 * Gets the current time as a NumericDate.
 *
 * A NumericDate is defined as the number of seconds that have elapsed since
 * 1970-01-01 00:00:00 UTC.
 *
 * This function calculates the current time in this format, suitable for use
 * in contexts where a simple numeric timestamp is required (e.g., JWT exp and nbf claims).
 *
 * @returns {NumericDate} The current time as a NumericDate.
 */
export function getNow(): NumericDate {
  return Math.floor(new Date().getTime() / 1000);
}
