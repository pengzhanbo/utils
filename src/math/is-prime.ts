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
 * @example
 * ```ts
 * isPrime(7) // => true
 * isPrime(4) // => false
 * isPrime(1) // => false
 * ```
 */
export function isPrime(n: number): boolean {
  if (Number.isNaN(n) || !Number.isFinite(n)) {
    return false
  }

  n = Math.floor(n)

  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false

  const sqrt = Math.sqrt(n)
  for (let i = 3; i <= sqrt; i += 2) {
    if (n % i === 0) return false
  }

  return true
}
