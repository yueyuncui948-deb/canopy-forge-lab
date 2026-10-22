export const MIN_DISTANCE = 1.5;
export const MAX_DISTANCE = 24;
export const DEFAULT_DISTANCE = 7.5;

export function zoomDistance(distance: number, wheelPixels: number): number {
  return Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, distance * Math.exp(wheelPixels * 0.0015)));
}
