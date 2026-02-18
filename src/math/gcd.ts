import { isFinite } from '../predicate'

/**
 * Greatest Common Divisor (GCD) of two numbers
 *
 * 计算两个数的最大公约数
 *
 * @category Math
 *
 * @param a - The first number. 第一个数
 * @param b - The second number. 第二个数
 * @returns The greatest common divisor of a and b. a和b的最大公约数
 *
 * @example
 * ```ts
 * gcd(12, 8) // => 4
 * gcd(17, 13) // => 1
 * gcd(0, 5) // => 5
 * ```
 */
export function gcd(a: number, b: number): number {
  if (Number.isNaN(a) || Number.isNaN(b) || !isFinite(a) || !isFinite(b)) {
    return Number.NaN
  }

  a = Math.abs(Math.floor(a))
  b = Math.abs(Math.floor(b))

  if (a === 0) return b
  if (b === 0) return a

  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }

  return a
}
