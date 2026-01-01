/**
 * Processing array-type data
 *
 * 处理数组类型的数据
 *
 * @module Array
 */

import type { Arrayable, Nullable } from './types'
import { isArray } from './is'
import { promiseParallel, Semaphore } from './promise'

/**
 * Convert `Arrayable<T>` to `Array<T>`
 *
 * 将 `Arrayable<T>` 转换为 `Array<T>`
 *
 * @category Array
 * @example
 * ```ts
 * toArray(null) // => []
 * toArray(undefined) // => []
 * toArray([]) // => []
 * toArray(1) // => [1]
 * ```
 */
export function toArray<T>(v: Nullable<Arrayable<T>>): Array<T> {
  if (v === null || v === undefined)
    return []
  if (isArray(v))
    return v
  return [v]
}

/**
 * Unique array
 *
 * 数组去重
 *
 * @category Array
 * @example
 * ```ts
 * uniq([1, 1, 2, 2, 3, 3]) // => [1, 2, 3]
 * ```
 */
export function uniq<T>(v: T[]): T[] {
  return Array.from(new Set(v))
}

/**
 * Unique array by a custom equality function
 *
 * 通过自定义相等函数实现数组去重
 *
 * @category Array
 * @example
 * ```ts
 * uniqueBy([1, 1, 2, 2, 3, 3], (a, b) => a === b) // => [1, 2, 3]
 * ```
 */
export function uniqueBy<T>(
  array: T[],
  equalFn: (a: T, b: T) => boolean,
): T[] {
  return array.reduce((acc: T[], cur) => {
    const index = acc.findIndex(item => equalFn(cur, item))
    if (index === -1)
      acc.push(cur)
    return acc
  }, [])
}

/**
 * Remove value from array
 *
 * 从数组中移除值
 *
 * @category Array
 *
 * @param array - the array
 * @param value - the value to remove - 待移除的值
 * @returns - if `true`, the value is removed, `false` otherwise.
 *          - 如果成功移除,返回 `true`, 否则返回 `false`
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3]
 * remove(arr, 2) // => true
 * console.log(arr) // => [1, 3]
 * remove(arr, 4) // => false
 * ```
 */
export function remove<T>(array: T[], value: T): boolean {
  if (!isArray(array))
    return false
  const index = array.indexOf(value)
  if (index !== -1) {
    array.splice(index, 1)
    return true
  }
  return false
}

/**
 * Generate a range array of numbers starting from `0`. The `stop` is exclusive.
 *
 * 从 `0` 开始生成一个数字范围的数组, `stop` 是不包含的。
 *
 * @category Array
 *
 * @param stop - the end of the range. 范围结束数字。
 *
 * @example
 * ```ts
 * range(5) // => [0, 1, 2, 3, 4]
 * ```
 */
export function range(stop: number): number[]
/**
 * Generate a range array of numbers. The `stop` is exclusive.
 *
 * 生成一个数字范围的数组, `stop` 是不包含的。
 *
 * @category Array
 *
 * @param start - the start of the range. 范围开始数字
 * @param stop - the end of the range. 范围结束数字
 * @param step - the step of the range. 步进
 *
 * @example
 * ```ts
 * range(5, 10) // => [5, 6, 7, 8, 9]
 * range(5, 10, 2) // => [5, 7, 9]
 * ```
 */
export function range(start: number, stop: number, step?: number): number[]
/**
 * Generate a range array of numbers. The `stop` is exclusive.
 *
 * 生成一个数字范围的数组, `stop` 是不包含的。
 *
 * @param args
 * @returns - a range array of numbers / 返回一个数字范围的数组
 */
export function range(...args: any): number[] {
  let start, stop, step
  if (args.length === 1) {
    start = 0
    stop = args[0]
    step = 1
  }
  else {
    ;[start, stop, step = 1] = args
  }
  const arr: number[] = []
  let current = start
  while (current < stop) {
    arr.push(current)
    current += step || 1
  }

  return arr
}

/**
 * Move item in an array
 *
 * 移动数组中的项
 *
 * @category Array
 *
 * @param arr - the array
 * @param from - the index of the item to move. 要移动的项的索引
 * @param to - the index to move to. 要移动到的索引
 * @returns the array with the item moved. 返回移动后的数组
 * @example
 * ```ts
 * move([1, 2, 3], 0, 2) // => [3, 1, 2]
 * ```
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
  if (!isArray(arr) || arr.length === 0) {
    return arr
  }
  arr.splice(to, 0, arr.splice(from, 1)[0]!)
  return arr
}

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

/**
 * Sort array
 *
 * 数组排序
 *
 * @category Array
 * @example
 * ```ts
 * const arr = [
 *  { name: 'Mark', age: 20 },
 *  { name: 'John', age: 18 },
 *  { name: 'Jack', age: 21 },
 *  { name: 'Tom', age: 18 },
 * ]
 * sortBy(arr, (item) => item.age) // => [ { name: 'John', age: 18 }, { name: 'Tom', age: 18 }, { name: 'Mark', age: 20 }, { name: 'Jack', age: 21 } ]
 * ```
 */
export function sortBy<T>(array: T[], cb: (item: T) => number): T[] {
  if (array.length === 0)
    return []
  return array.sort((a, b) => {
    const s1 = cb(a)
    const s2 = cb(b)
    return s1 > s2 ? 1 : s2 > s1 ? -1 : 0
  })
}

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

/**
 * Union two arrays
 *
 * 两个数组的并集
 *
 * @category Array
 *
 * @example
 * ```ts
 * union([1, 2, 3], [2, 4, 5, 6]) // => [1, 2, 3, 4, 5, 6]
 * ```
 */
export function union<T>(a: T[], b: T[]): T[] {
  return [...new Set([...a, ...b])]
}

/**
 * Intersection of two arrays
 *
 * 两个数组的交集
 *
 * @category Array
 * @example
 * ```ts
 * intersection([1, 2, 3], [2, 4, 5, 6]) // => [2]
 * ```
 */
export function intersection<T>(firstArr: readonly T[], secondArr: readonly T[]): T[] {
  const secondSet = new Set(secondArr)

  return firstArr.filter((item) => {
    return secondSet.has(item)
  })
}

/**
 * Computes the difference between two arrays.
 *
 * This function takes two arrays and returns a new array containing the elements
 * that are present in the first array but not in the second array. It effectively
 * filters out any elements from the first array that also appear in the second array.
 *
 * 计算两个数组之间的差异。
 *
 * 此函数接收两个数组，并返回一个新数组，其中包含存在于第一个数组中但不在第二个数组中的元素。
 * 它有效地过滤掉第一个数组中同时出现在第二个数组中的任何元素。
 *
 * @category Array
 * @example
 * ```ts
 * difference([1, 2, 3, 4, 5], [2, 4])
 * // => [1, 3, 5]
 * ```
 */
export function difference<T>(firstArr: readonly T[], secondArr: readonly T[]): T[] {
  const set = new Set(secondArr)
  return firstArr.filter(item => !set.has(item))
}

/**
 * Computes the difference between two arrays after mapping their elements through a provided function.
 *
 * This function takes two arrays and a mapper function. It returns a new array containing the elements
 * that are present in the first array but not in the second array, based on the identity calculated
 * by the mapper function.
 *
 * Essentially, it filters out any elements from the first array that, when
 * mapped, match an element in the mapped version of the second array.
 *
 * 计算两个数组在通过提供的函数映射其元素后的差异。
 *
 * 此函数接收两个数组和一个映射函数。它返回一个新数组，包含那些存在于第一个数组中但不在第二个数组中的元素，
 * 基于映射函数计算出的标识。
 *
 * 本质上，它会过滤掉第一个数组中那些在映射后与第二个数组映射版本中元素匹配的元素。
 *
 * @category Array
 * @example
 * ```ts
 * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }]
 * const array2 = [{ id: 2 }, { id: 4 }]
 * const mapper = item => item.id
 * const result = differenceBy(array1, array2, mapper)
 * // -> [{ id: 1 }, { id: 3 }]
 * ```
 * @example
 * ```ts
 * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }]
 * const array2 = [2, 4]
 * const mapper = item => (typeof item === 'object' ? item.id : item)
 * const result = differenceBy(array1, array2, mapper)
 * // -> [{ id: 1 }, { id: 3 }]
 * ```
 */
export function differenceBy<T, U>(
  firstArr: readonly T[],
  secondArr: readonly U[],
  mapper: (value: T | U) => unknown,
): T[] {
  const set = new Set(secondArr.map(item => mapper(item)))

  return firstArr.filter(item => !set.has(mapper(item)))
}

/**
 * Wraps an async function to limit the number of concurrent executions.
 *
 * This function creates a wrapper around an async callback that ensures at most
 * `concurrency` number of executions can run simultaneously. Additional calls will
 * wait until a slot becomes available.
 *
 * 将异步函数包装起来以限制并发执行的数量。
 *
 * 此函数创建一个异步回调的包装器，确保最多只有`concurrency`个执行可以同时运行。
 * 额外的调用将等待直到有可用的执行槽位。
 *
 * @category Array
 * @example
 * ```ts
 * const limitedFetch = limitAsync(async (url) => {
 *   return await fetch(url);
 * }, 3);
 *
 * // Only 3 fetches will run concurrently
 * const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
 * await Promise.all(urls.map(url => limitedFetch(url)));
 * ```
 */
export function limitAsync<F extends (...args: any[]) => Promise<any>>(callback: F, concurrency: number): F {
  const semaphore = new Semaphore(concurrency)

  return async function (this: ThisType<F>, ...args: Parameters<F>): Promise<ReturnType<F>> {
    try {
      await semaphore.acquire()
      return await callback.apply(this, args)
    }
    finally {
      semaphore.release()
    }
  } as F
}

/**
 * Filters an array asynchronously using an async predicate function.
 *
 * Returns a promise that resolves to a new array containing only the elements
 * for which the predicate function returns a truthy value.
 *
 * 使用异步谓词函数对数组进行异步过滤。
 *
 * 返回一个Promise，该Promise解析为一个新数组，仅包含谓词函数返回真值的元素。
 *
 * @category Array
 * @example
 * ```ts
 * const users = [{ id: 1, active: true }, { id: 2, active: false }, { id: 3, active: true }];
 * const activeUsers = await filterAsync(users, async (user) => {
 *   return await checkUserStatus(user.id);
 * });
 * // Returns: [{ id: 1, active: true }, { id: 3, active: true }]
 * ```
 */
export async function filterAsync<T>(
  array: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => Promise<boolean>,
  concurrency?: number,
): Promise<T[]> {
  const result = await promiseParallel(
    array.map((...args) => () => predicate(...args)),
    concurrency,
  ) as boolean[]

  return array.filter((_, index) => result[index])
}

/**
 * Transforms each element in an array using an async callback function and returns
 * a promise that resolves to an array of transformed values.
 *
 * 使用异步回调函数转换数组中的每个元素，并返回一个解析为转换后值数组的 promise。
 *
 * @example
 * ```ts
 * const users = [{ id: 1 }, { id: 2 }, { id: 3 }];
 * const userDetails = await mapAsync(users, async (user) => {
 *   return await fetchUserDetails(user.id);
 * });
 * // Returns: [{ id: 1, name: '...' }, { id: 2, name: '...' }, { id: 3, name: '...' }]
 * ```
 *
 * @example
 * ```ts
 * // With concurrency limit
 * const numbers = [1, 2, 3, 4, 5];
 * const results = await mapAsync(
 *   numbers,
 *   async (n) => await slowOperation(n),
 *   2
 * );
 * // Processes at most 2 operations concurrently
 * ```
 */
export async function mapAsync<T>(
  array: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => Promise<T>,
  concurrency?: number,
): Promise<T[]> {
  return await promiseParallel(
    array.map((...args) => () => predicate(...args)),
    concurrency,
  ) as T[]
}
