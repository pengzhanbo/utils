/**
 * Find the first element in the array that satisfies the provided testing function and execute the given callback function.
 *
 * 查找数组中第一个满足提供的测试函数的元素，并执行给定的回调函数。
 *
 * @param array The array to search in 要搜索的数组
 * @param predicate A function to test each element. Return true to indicate a matching element has been found. 用于测试每个元素的函数。返回 true 表示已找到匹配元素。
 * @param then A function to execute on the found element. 找到匹配元素后要执行的函数。
 * @param start The index at which to start the search. Defaults to 0. 开始搜索的索引。默认值为 0。
 * @returns Whether any element satisfies the testing function. 是否有任何元素满足测试函数。
 *
 * @category Array
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5]
 * findFirstThen(arr, (v) => v > 3, (v) => console.log(v)) // 4
 * ```
 */
export function findFirstThen<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
  then: (value: T, index: number, array: T[]) => void,
  start = 0,
): boolean {
  return _findThen(array, predicate, then, start)
}

/**
 * Find the last element in the array that satisfies the provided testing function and execute the given callback function.
 *
 * 查找数组中最后一个满足提供的测试函数的元素，并执行给定的回调函数。
 *
 * @param array The array to search in 要搜索的数组
 * @param predicate A function to test each element. Return true to indicate a matching element has been found. 用于测试每个元素的函数。返回 true 表示已找到匹配元素。
 * @param then A function to execute on the found element. 找到匹配元素后要执行的函数。
 * @param start The index at which to start the search. Defaults to 0. 开始搜索的索引。默认值为 0。
 * @returns Whether any element satisfies the testing function. 是否有任何元素满足测试函数。
 *
 * @category Array
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5]
 * findLastThen(arr, (v) => v > 3, (v) => console.log(v)) // 5
 * ```
 */
export function findLastThen<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
  then: (value: T, index: number, array: T[]) => void,
  start = array.length - 1,
): boolean {
  return _findThen(array, predicate, then, start, true)
}

function _findThen<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
  then: (value: T, index: number, array: T[]) => void,
  start = 0,
  lastIndex = false,
): boolean {
  const end = lastIndex ? -1 : array.length
  const step = lastIndex ? -1 : 1
  for (let i = start; i !== end; i += step) {
    if (predicate(array[i]!, i, array)) {
      then(array[i]!, i, array)
      return true
    }
  }
  return false
}
