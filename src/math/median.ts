/**
 * Median of an array of numbers
 *
 * 计算数组中所有数字的中位数
 *
 * @category Math
 *
 * @param numbers - The array of numbers to calculate the median. 要计算中位数的数字数组
 * @returns The median of the numbers. 数组中所有数字的中位数
 *
 * @example
 * ```ts
 * median([1, 2, 3, 4, 5]) // => 3
 * median([1, 2, 3, 4]) // => 2.5
 * median([]) // => NaN
 * ```
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) {
    return Number.NaN
  }

  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2
  }

  return sorted[mid]!
}
