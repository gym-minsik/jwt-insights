import { Duration } from './duration';

describe('Duration', () => {
  it('should default to 0 seconds if no arguments are provided', () => {
    const duration = new Duration();
    expect(duration.inSeconds).toBe(0);
  });

  it('should correctly calculate duration from seconds', () => {
    const seconds = 30;
    const duration = new Duration({ seconds });
    expect(duration.inSeconds).toBe(seconds);
    expect(duration.inMinutes).toBe(seconds / 60);
    expect(duration.InHours).toBe(seconds / 3600);
  });

  it('should correctly calculate duration from minutes', () => {
    const minutes = 2;
    const duration = new Duration({ minutes });
    expect(duration.inSeconds).toBe(minutes * 60);
    expect(duration.inMinutes).toBe(minutes);
    expect(duration.InHours).toBe(minutes / 60);
  });

  it('should correctly calculate duration from hours', () => {
    const hours = 1;
    const duration = new Duration({ hours });
    expect(duration.inSeconds).toBe(hours * 3600);
    expect(duration.inMinutes).toBe(hours * 60);
    expect(duration.InHours).toBe(hours);
  });

  it('should handle combined duration inputs correctly', () => {
    const args = { seconds: 30, minutes: 1, hours: 1 };
    const duration = new Duration(args);
    const expectedSeconds =
      args.seconds + args.minutes * 60 + args.hours * 3600;
    expect(duration.inSeconds).toBe(expectedSeconds);
    expect(duration.inMinutes).toBe(expectedSeconds / 60);
    expect(duration.InHours).toBe(expectedSeconds / 3600);
  });

  it('should round down fractional seconds in the input', () => {
    const duration = new Duration({ seconds: 30.907, minutes: 1 });
    expect(duration.inSeconds).toBe(90);
  });
});
