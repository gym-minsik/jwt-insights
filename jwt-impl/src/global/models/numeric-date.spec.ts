import { Duration } from './duration';
import { NumericDate } from './numeric-date';

describe('NumericDate', () => {
  describe('constructor', () => {
    it('should create an instance with the specified seconds since epoch', () => {
      const seconds = 1618884000; // Example UNIX timestamp
      const date = new NumericDate(seconds);
      expect(date.secondsSinceEpoch).toBe(seconds);
    });

    it('should round down to the nearest whole number', () => {
      const seconds = 1618884000.123;
      const date = new NumericDate(seconds);
      expect(date.secondsSinceEpoch).toBe(Math.floor(seconds));
    });

    it('should throw an error if secondsSinceEpoch is negative', () => {
      const seconds = -1618884000;
      expect(() => new NumericDate(seconds)).toThrow(
        'NumericDate must be non-negative integer.'
      );
    });
  });

  describe('now', () => {
    it('should return the current date as a NumericDate', () => {
      const before = Math.floor(Date.now() / 1000);
      const now = NumericDate.now().secondsSinceEpoch;
      const after = Math.floor(Date.now() / 1000);
      expect(now).toBeGreaterThanOrEqual(before);
      expect(now).toBeLessThanOrEqual(after);
    });
  });

  describe('add', () => {
    it('should return a new NumericDate increased by the specified duration', () => {
      const initialSeconds = 1618884000;
      const duration = new Duration({ hours: 1 }); // 1 hour
      const date = new NumericDate(initialSeconds).add(duration);
      expect(date.secondsSinceEpoch).toBe(initialSeconds + duration.inSeconds);
    });
  });

  describe('Comparison methods', () => {
    const date1 = new NumericDate(1618884000);
    const date2 = new NumericDate(1618884000 + 3600); // 1 hour later

    it('should correctly report if one date is after another', () => {
      expect(date2.isAfter(date1)).toBe(true);
      expect(date1.isAfter(date2)).toBe(false);
    });

    it('should correctly report if one date is after or equal to another', () => {
      expect(date2.isAfterOrEqual(date1)).toBe(true);
      expect(date1.isAfterOrEqual(date2)).toBe(false);
      expect(date1.isAfterOrEqual(new NumericDate(1618884000))).toBe(true);
    });

    it('should correctly report if one date is before another', () => {
      expect(date1.isBefore(date2)).toBe(true);
      expect(date2.isBefore(date1)).toBe(false);
    });

    it('should correctly report if one date is before or equal to another', () => {
      expect(date1.isBeforeOrEqual(date2)).toBe(true);
      expect(date2.isBeforeOrEqual(date1)).toBe(false);
      expect(date1.isBeforeOrEqual(new NumericDate(1618884000))).toBe(true);
    });
  });

  describe('toDate', () => {
    it('should convert a NumericDate to a Date object', () => {
      const seconds = 1618884000;
      const numericDate = new NumericDate(seconds);
      const dateObject = numericDate.toDate();
      expect(dateObject).toEqual(new Date(seconds * 1000));
    });
  });
});
