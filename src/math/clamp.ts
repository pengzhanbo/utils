/**
 * Clamp a number between min and max
 *
 * 返回一个介于最小值和最大值之间的数字
 *
 * @category Math
 *
 * @param n - The number to clamp. 要限制的数字
 * @param min - The minimum value. 最小值
 * @param max - The maximum value. 最大值
 * @returns The clamped number. 限制后的数字
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(n, min))
}
