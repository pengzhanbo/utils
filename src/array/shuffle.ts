/**
 * Shuffle array
 *
 * 数组洗牌，随机打乱数组中的顺序
 *
 * @category Array
 * @example
 * ```ts
 * shuffle([1, 2, 3]) // => [1, 3, 2]
 * ```
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j]!, array[i]!]
  }
  return array
}
