import { Duration } from './duration';

export class NumericDate {
  public readonly secondsSinceEpoch: number;
  constructor(secondsSinceEpoch: number) {
    this.secondsSinceEpoch = Math.floor(secondsSinceEpoch);

    if (this.secondsSinceEpoch < 0) {
      throw new Error('NumericDate must be non-negative integer.');
    }
  }

  static now() {
    const dateNow = new Date();

    return new NumericDate(dateNow.getTime() / 1000);
  }

  add(duration: Duration): NumericDate {
    return new NumericDate(this.secondsSinceEpoch + duration.inSeconds);
  }

  isAfter(other: NumericDate) {
    return this.secondsSinceEpoch > other.secondsSinceEpoch;
  }

  isAfterOrEqual(other: NumericDate) {
    return this.secondsSinceEpoch >= other.secondsSinceEpoch;
  }

  isBefore(other: NumericDate) {
    return this.secondsSinceEpoch < other.secondsSinceEpoch;
  }

  isBeforeOrEqual(other: NumericDate) {
    return this.secondsSinceEpoch <= other.secondsSinceEpoch;
  }

  toDate(): Date {
    return new Date(this.secondsSinceEpoch * 1000);
  }
}
