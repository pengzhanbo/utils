/**
 * Linear interpolation between two values
 *
 * 在两个值之间进行线性插值
 *
 * @category Math
 *
 * @param start - The start value. 起始值
 * @param end - The end value. 结束值
 * @param m - The interpolation factor (unclamped, values outside [0,1] enable extrapolation). 插值因子（不钳位，超出 [0,1] 的值可进行外推）
 * @returns The interpolated value. 插值结果
 *
 * @remarks
 * The interpolation factor `m` is not clamped to [0, 1]. Values outside this range enable extrapolation beyond the start and end values.
 *
 * 插值因子 `m` 不会被限制在 [0, 1] 范围内。超出此范围的值可以进行外推。
 *
 * @example
 * ```ts
 * lerp(0, 100, 0) // => 0
 * lerp(0, 100, 1) // => 100
 * lerp(0, 100, 0.5) // => 50
 * ```
 */
export function lerp(start: number, end: number, m: number): number {
  return start + (end - start) * m
}
