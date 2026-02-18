import { isFinite } from '../predicate'
import { gcd } from './gcd'

/**
 * Least Common Multiple (LCM) of two numbers
 *
 * 计算两个数的最小公倍数
 *
 * @category Math
 *
 * @param a - The first number. 第一个数
 * @param b - The second number. 第二个数
 * @returns The least common multiple of a and b. a和b的最小公倍数
 *
 * @example
 * ```ts
 * lcm(12, 8) // => 24
 * lcm(17, 13) // => 221
 * lcm(0, 5) // => 0
 * ```
 */
export function lcm(a: number, b: number): number {
  if (Number.isNaN(a) || Number.isNaN(b) || !isFinite(a) || !isFinite(b)) {
    return Number.NaN
  }

  if (a === 0 || b === 0) return 0

  const absA = Math.abs(Math.floor(a))
  const absB = Math.abs(Math.floor(b))

  return (absA / gcd(absA, absB)) * absB
}
