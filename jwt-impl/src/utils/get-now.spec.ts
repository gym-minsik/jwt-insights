import { getNow } from './get-now';

describe('getNow', () => {
  it('returns the current time in NumericDate format', () => {
    const before = Math.floor(new Date().getTime() / 1000);
    const now = getNow();
    const after = Math.floor(new Date().getTime() / 1000);

    expect(now).toBeGreaterThanOrEqual(before);
    expect(now).toBeLessThanOrEqual(after);
  });

  it('is close to the actual current time within a small delta', () => {
    const now = getNow();
    const actualNow = Math.floor(new Date().getTime() / 1000);
    const delta = Math.abs(now - actualNow);

    // Assuming a delta of 1 second is reasonable to account for the execution time of the function
    expect(delta).toBeLessThanOrEqual(1);
  });
});
