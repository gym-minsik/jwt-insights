// 최소 단위 secondss
export class Duration {
  private readonly seconds: number;

  constructor(args?: { seconds?: number; minutes?: number; hours?: number }) {
    if (!args) {
      this.seconds = 0;
      return;
    }

    args.seconds ??= 0;
    args.minutes ??= 0;
    args.hours ??= 0;

    this.seconds = Math.floor(
      args.seconds + args.minutes * 60 + args.hours * (60 * 60)
    );
  }

  get InHours(): number {
    return this.inSeconds / (60 * 60);
  }

  get inMinutes(): number {
    return this.seconds / 60;
  }

  get inSeconds(): number {
    return this.seconds;
  }
}
