/**
 * Clamp a number between min and max
 * @category Math
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(n, min))
}
