/**
 * Find the first element in the array that satisfies the provided testing function and execute the given callback function.
 *
 * 查找数组中第一个满足提供的测试函数的元素，并执行给定的回调函数。
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param array The array to search in / 要搜索的数组
 * @param predicate A function to test each element. Return true to indicate a matching element has been found. / 用于测试每个元素的函数。返回 true 表示已找到匹配元素。
 * @param then A function to execute on the found element. / 找到匹配元素后要执行的函数。
 * @param start The index at which to start the search. Defaults to 0 (beginning of the array). / 开始搜索的索引。默认为 0（数组开头）。
 * @returns Whether any element satisfies the testing function. / 是否有任何元素满足测试函数。
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5]
 * findFirstThen(arr, (v) => v > 3, (v) => console.log(v)) // 4
 * ```
 */
export function findFirstThen<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean,
  then: (value: T, index: number, array: readonly T[]) => void,
  start: number = 0,
): boolean {
  return _findThen(array, predicate, then, start)
}

/**
 * Find the last element in the array that satisfies the provided testing function and execute the given callback function.
 *
 * 查找数组中最后一个满足提供的测试函数的元素，并执行给定的回调函数。
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param array The array to search in / 要搜索的数组
 * @param predicate A function to test each element. Return true to indicate a matching element has been found. / 用于测试每个元素的函数。返回 true 表示已找到匹配元素。
 * @param then A function to execute on the found element. / 找到匹配元素后要执行的函数。
 * @param start The index at which to start the search. Defaults to the last index of the array. / 开始搜索的索引。默认值为 array.length - 1。
 * @returns Whether any element satisfies the testing function. / 是否有任何元素满足测试函数。
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5]
 * findLastThen(arr, (v) => v > 3, (v) => console.log(v)) // 5
 * ```
 */
export function findLastThen<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean,
  then: (value: T, index: number, array: readonly T[]) => void,
  start: number = array.length - 1,
): boolean {
  return _findThen(array, predicate, then, start, true)
}

function _findThen<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean,
  then: (value: T, index: number, array: readonly T[]) => void,
  start: number = 0,
  lastIndex = false,
): boolean {
  if (Number.isNaN(start)) throw new TypeError('start must be a valid number')

  const end = lastIndex ? -1 : array.length
  const step = lastIndex ? -1 : 1
  start = Math.max(lastIndex ? -1 : 0, Math.min(start, array.length - 1))

  for (let i = start; lastIndex ? i > end : i < end; i += step) {
    if (predicate(array[i]!, i, array)) {
      then(array[i]!, i, array)
      return true
    }
  }
  return false
}
