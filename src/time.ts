export function frameDelta(now: number, previous: number | null): number {
  return previous === null ? 0 : Math.max(0, Math.min((now - previous) / 1000, 0.045));
}
