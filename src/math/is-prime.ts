import { isInteger, isFinite } from '../predicate'

/**
 * Check if a number is prime
 *
 * 检查一个数是否为质数
 *
 * @category Math
 *
 * @param n - The number to check. 要检查的数字
 * @returns True if the number is prime, false otherwise. 如果是质数则返回true，否则返回false
 *
 * @remarks
 * This function uses trial division (O(√n)). For inputs > 1e12, it may be very slow (millions of iterations). Not suitable for cryptographic use. Consider using a probabilistic primality test (e.g. Miller-Rabin) for large numbers.
 *
 * 此函数使用试除法（O(√n)）。对于大于 1e12 的输入，可能非常慢（数百万次迭代）。不适合密码学使用场景。对于大数，请考虑使用概率素性测试（如 Miller-Rabin）。
 *
 * @example
 * ```ts
 * isPrime(7) // => true
 * isPrime(4) // => false
 * isPrime(1) // => false
 * ```
 */
export function isPrime(n: number): boolean {
  if (Number.isNaN(n) || !isFinite(n) || !isInteger(n)) {
    return false
  }

  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false

  const sqrt = Math.sqrt(n)
  for (let i = 3; i <= sqrt; i += 2) {
    if (n % i === 0) return false
  }

  return true
}
