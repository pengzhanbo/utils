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
  const count = arrays.length
  if (count === 0) {
    return []
  }

  if (count === 1) {
    return arrays[0]!.map((value) => [value])
  }

  let len = arrays[0]!.length
  for (let j = 1; j < count; j++) {
    const size = arrays[j]!.length
    if (size < len) {
      len = size
    }
  }

  if (count === 2) {
    const a = arrays[0]!
    const b = arrays[1]!
    // oxlint-disable-next-line unicorn/no-new-array -- preallocate to avoid growth
    const result: unknown[][] = new Array(len)
    for (let i = 0; i < len; i++) {
      result[i] = [a[i], b[i]]
    }
    return result
  }

  const cols = arrays
  // oxlint-disable-next-line unicorn/no-new-array -- preallocate to avoid growth
  const result: unknown[][] = new Array(len)
  for (let i = 0; i < len; i++) {
    // oxlint-disable-next-line unicorn/no-new-array -- preallocate to avoid growth
    const row: unknown[] = new Array(count)
    for (let j = 0; j < count; j++) {
      row[j] = cols[j]![i]
    }
    result[i] = row
  }

  return result
}
