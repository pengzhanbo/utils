/**
 * Convert degrees to radians
 *
 * 将角度转换为弧度
 *
 * @category Math
 *
 * @param degrees - The angle in degrees. 角度值
 * @returns The angle in radians. 弧度值
 *
 * @example
 * ```ts
 * degToRad(180) // => Math.PI
 * degToRad(90) // => Math.PI / 2
 * degToRad(0) // => 0
 * ```
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}
