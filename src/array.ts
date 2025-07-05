/**
 * Processing array-type data
 *
 * 处理数组类型的数据
 *
 * @module Array
 */

import type { Arrayable, Nullable } from './types'
import { isArray } from './is'

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
  arr.splice(to, 0, arr.splice(from, 1)[0])
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
    ;[array[i], array[j]] = [array[j], array[i]]
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
