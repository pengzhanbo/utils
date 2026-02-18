/**
 * Map a value from one range to another
 *
 * 将一个值从一个范围映射到另一个范围
 *
 * @category Math
 *
 * @param value - The value to map. 要映射的值
 * @param inMin - The minimum of the input range. 输入范围的最小值
 * @param inMax - The maximum of the input range. 输入范围的最大值
 * @param outMin - The minimum of the output range. 输出范围的最小值
 * @param outMax - The maximum of the output range. 输出范围的最大值
 * @returns The mapped value. 映射后的值
 *
 * @example
 * ```ts
 * mapRange(5, 0, 10, 0, 100) // => 50
 * mapRange(0, 0, 10, 0, 100) // => 0
 * mapRange(10, 0, 10, 0, 100) // => 100
 * ```
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}
