/**
 * Split array into chunks
 *
 * 将数组拆分成块
 *
 * @category Array
 *
 * @param input - the array
 * @param size - the chunk size. 块的大小
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2) // => [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(input: T[], size = 1): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < input.length; i += size)
    chunks.push(input.slice(i, i + size))

  return chunks
}
