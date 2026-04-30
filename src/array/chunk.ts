/**
 * Split array into chunks
 *
 * 将数组拆分成块
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param input - The array to be chunked. 要分块的数组
 * @param size - The size of each chunk. Defaults to 1. Floats are truncated via `parseInt`. If the result is not a positive integer, defaults to 1. 每个块的大小，默认为1。浮点数通过 `parseInt` 取整。如果结果不是正整数，则默认为 1。
 * @returns A new array of chunks. 分块后的新数组
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2) // => [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(input: readonly T[], size = 1): T[][] {
  size = Number.parseInt(String(size), 10)
  if (Number.isNaN(size) || size < 1) size = 1
  const chunks: T[][] = []
  for (let i = 0; i < input.length; i += size) chunks.push(input.slice(i, i + size))

  return chunks
}
