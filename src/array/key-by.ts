/**
 * Creates an object composed of keys generated from the results of running
 * each element of an array through the given function.
 *
 * The opposite of `groupBy`, this function creates an object where each key
 * is the result of the iteratee function, and the value is the last element
 * that produced that key.
 *
 * 创建一个对象，键由数组的每个元素经过给定函数运行后的结果生成。
 *
 * 与 `groupBy` 相反，此函数创建一个对象，其中每个键是 iteratee 函数的结果，
 * 值是产生该键的最后一个元素。
 *
 * @category Array
 *
 * @param array - The array to convert. 要转换的数组
 * @param iteratee - The function to transform elements into keys. 将元素转换为键的函数
 * @returns An object with keys mapped to the last element that produced each key. 键映射到产生该键的最后一个元素的对象
 *
 * @performance Uses Map for O(1) key lookup, overall O(n) time complexity
 *              使用 Map 实现 O(1) 键查找，整体时间复杂度 O(n)
 *
 * @example
 * ```ts
 * keyBy([{ id: 1, name: 'a' }, { id: 2, name: 'b' }], x => x.id)
 * // => { 1: { id: 1, name: 'a' }, 2: { id: 2, name: 'b' } }
 * ```
 *
 * @example
 * ```ts
 * keyBy(['one', 'two', 'three'], x => x.length)
 * // => { 3: 'two', 5: 'three' }
 * ```
 */
export function keyBy<T, K extends PropertyKey>(
  array: readonly T[],
  iteratee: (item: T) => K,
): Record<K, T> {
  const result = {} as Record<K, T>

  for (let i = 0; i < array.length; i++) {
    const item = array[i]!
    const key = iteratee(item)
    result[key] = item
  }

  return result
}
