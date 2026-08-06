/**
 * Zips multiple arrays by index, pairing the elements at each position.
 *
 * The result length is determined by the shortest input array; elements of
 * longer arrays beyond that length are ignored. The input arrays are not
 * mutated.
 *
 * 按索引将多个数组配对组合。
 *
 * 结果长度由最短的输入数组决定，较长数组中超出该长度的元素会被忽略。不会修改输入数组。
 *
 * @category Array
 *
 * @param arrays - The arrays to zip. 要配对的数组
 * @returns An array of tuples, each containing the elements at the same index. 元组数组，每个元组包含同一索引位置的元素
 *
 * @remarks
 * Unlike lodash / es-toolkit (which pad with `undefined` to the longest
 * length), the result is truncated to the shortest array.
 *
 * 与 lodash / es-toolkit（以最长数组为准并用 `undefined` 补齐）不同，结果以最短数组为准截断。
 *
 * @example
 * ```ts
 * zip([1, 2], ['a', 'b', 'c'])
 * // => [[1, 'a'], [2, 'b']]
 * ```
 *
 * @example
 * ```ts
 * zip([1, 2, 3], ['a', 'b'], [true, false, true])
 * // => [[1, 'a', true], [2, 'b', false]]
 * ```
 */
export function zip(...arrays: readonly unknown[][]): unknown[][] {
  if (arrays.length === 0) {
    return []
  }

  const minLength = Math.min(...arrays.map((arr) => arr.length))
  const result: unknown[][] = []

  for (let i = 0; i < minLength; i++) {
    const row: unknown[] = []
    for (let j = 0; j < arrays.length; j++) {
      row.push(arrays[j]![i])
    }
    result.push(row)
  }

  return result
}
