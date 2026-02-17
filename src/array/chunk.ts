/**
 * Split array into chunks
 *
 * 将数组拆分成块
 *
 * @category Array
 *
 * @param input - The array to be chunked. 要分块的数组
 * @param size - The size of each chunk. Defaults to 1. 每个块的大小，默认为1
 * @returns A new array of chunks. 分块后的新数组
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2) // => [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(input: T[], size = 1): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < input.length; i += size) chunks.push(input.slice(i, i + size))

  return chunks
}
