/**
 * Clamp a number between min and max
 *
 * 返回一个介于最小值和最大值之间的数字
 *
 * @category Math
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(n, min))
}
