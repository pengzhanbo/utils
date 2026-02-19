/**
 * Groups the elements of an array based on the given function.
 *
 * This function takes an array and a grouping function, and returns an object
 * where each key is a value returned by the grouping function, and the value
 * is an array of elements that produced that key.
 *
 * 根据给定函数对数组元素进行分组。
 *
 * 此函数接收一个数组和一个分组函数，返回一个对象，其中每个键是由分组函数返回的值，
 * 值是产生该键的元素数组。
 *
 * @category Array
 *
 * @param array - The array to group. 要分组的数组
 * @param iteratee - The function to transform elements into group keys. 将元素转换为分组键的函数
 * @returns An object with grouped elements. 分组后的对象
 *
 * @performance Uses Map for O(1) key lookup, overall O(n) time complexity
 *              使用 Map 实现 O(1) 键查找，整体时间复杂度 O(n)
 *
 * @example
 * ```ts
 * groupBy([{ type: 'a', val: 1 }, { type: 'b', val: 2 }, { type: 'a', val: 3 }], x => x.type)
 * // => { a: [{ type: 'a', val: 1 }, { type: 'a', val: 3 }], b: [{ type: 'b', val: 2 }] }
 * ```
 *
 * @example
 * ```ts
 * groupBy([6.1, 4.2, 6.3], Math.floor)
 * // => { 6: [6.1, 6.3], 4: [4.2] }
 * ```
 *
 * @example
 * ```ts
 * groupBy(['one', 'two', 'three'], x => x.length)
 * // => { 3: ['one', 'two'], 5: ['three'] }
 * ```
 */
export function groupBy<T, K extends PropertyKey>(
  array: readonly T[],
  iteratee: (item: T) => K,
): Record<K, T[]> {
  const result = {} as Record<K, T[]>

  for (let i = 0; i < array.length; i++) {
    const item = array[i]!
    const key = iteratee(item)

    if (key in result) {
      result[key].push(item)
    } else {
      result[key] = [item]
    }
  }

  return result
}
