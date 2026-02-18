/**
 * Convert radians to degrees
 *
 * 将弧度转换为角度
 *
 * @category Math
 *
 * @param radians - The angle in radians. 弧度值
 * @returns The angle in degrees. 角度值
 *
 * @example
 * ```ts
 * radToDeg(Math.PI) // => 180
 * radToDeg(Math.PI / 2) // => 90
 * radToDeg(0) // => 0
 * ```
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI
}
