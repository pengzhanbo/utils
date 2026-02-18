/**
 * Linear interpolation between two values
 *
 * 在两个值之间进行线性插值
 *
 * @category Math
 *
 * @param start - The start value. 起始值
 * @param end - The end value. 结束值
 * @param t - The interpolation factor (0-1). 插值因子（0-1）
 * @returns The interpolated value. 插值结果
 *
 * @example
 * ```ts
 * lerp(0, 100, 0) // => 0
 * lerp(0, 100, 1) // => 100
 * lerp(0, 100, 0.5) // => 50
 * ```
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}
