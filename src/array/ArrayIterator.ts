import { findIndex } from '../_internal/find-index'
import {
  OPERATION_FILTER,
  OPERATION_MAP,
  OPERATION_TAKE,
  OPERATION_DROP,
} from '../_internal/iterator'
import { isFunction, isInteger, isNumber } from '../predicate'

/**
 * Predicate function type for filtering array elements
 *
 * 用于过滤数组元素的断言函数类型
 */
export type ArrayIteratorPredicate<T> = (value: T, index: number) => boolean

/**
 * Transform function type for mapping array elements
 *
 * 用于映射数组元素的转换函数类型
 */
export type ArrayIteratorTransform<T, R> = (value: T, index: number) => R

/**
 * Callback function type for forEach
 *
 * forEach 回调函数类型
 */
export type ArrayIteratorCallback<T> = (value: T, index: number) => void

/**
 * Operation type for lazy evaluation (internal)
 *
 * 惰性计算的操作类型（内部使用）
 */
type Operation<T> =
  | { type: 'filter'; predicate: (value: T, index: number) => boolean }
  | { type: 'map'; transform: (value: T, index: number) => unknown }
  | { type: 'take'; limit: number }
  | { type: 'drop'; count: number }

/**
 * An iterator class for arrays with chainable operations and lazy evaluation
 *
 * 支持链式操作和惰性计算的数组迭代器类
 *
 * @typeParam T - The type of elements in the array. 数组元素的类型
 *
 * @category Array
 *
 * @example
 * ```ts
 * const result = new ArrayIterator([1, 2, 3, 4, 5])
 *   .filter((v) => v > 2)
 *   .map((v) => v * 2)
 *   .take(2)
 *   .toArray()
 * // => [6, 8]
 * ```
 */
export class ArrayIterator<T = unknown> {
  /**
   * The source array to iterate over. 要迭代的源数组
   */
  private readonly s: unknown[]
  /**
   * The list of operations to be applied lazily
   *
   * 要惰性应用的操作列表
   */
  private readonly o: Operation<unknown>[]

  /**
   * Creates a new ArrayIterator instance
   *
   * 创建一个新的 ArrayIterator 实例
   *
   * @param array - The source array to iterate. 要迭代的源数组
   */
  constructor(array: T[]) {
    this.s = array
    this.o = []
  }

  /**
   * Creates a new iterator with existing source and operations
   *
   * 使用现有源数据和操作创建新迭代器
   */
  private static create<T>(source: unknown[], operations: Operation<unknown>[]): ArrayIterator<T> {
    const iterator = new ArrayIterator<T>(source as T[])
    ;(iterator as unknown as { o: Operation<unknown>[] }).o = operations
    return iterator
  }

  /**
   * Creates a generator that applies all operations in a single pass
   *
   * 创建一个在单次遍历中应用所有操作的生成器
   */
  private *iterate(): Generator<T> {
    const firstTakeIndex = findIndex(this.o, (op) => op.type === OPERATION_TAKE)
    const firstDropIndex = findIndex(this.o, (op) => op.type === OPERATION_DROP)

    let hasFilterBeforeLimit = false
    const limitIndex = firstTakeIndex !== -1 ? firstTakeIndex : firstDropIndex
    if (limitIndex !== -1) {
      for (let i = 0; i < limitIndex; i++) {
        const op = this.o[i]
        if (op && op.type === OPERATION_FILTER) {
          hasFilterBeforeLimit = true
          break
        }
      }
    }

    let minTakeLimit = Infinity
    let dropCount = 0
    for (const op of this.o) {
      if (op.type === OPERATION_TAKE) {
        minTakeLimit = Math.min(minTakeLimit, op.limit)
      }
      if (op.type === OPERATION_DROP) {
        dropCount += op.count
      }
    }

    let processedCount = 0
    let yieldedCount = 0
    let droppedCount = 0

    for (let i = 0; i < this.s.length; i++) {
      const entry = this.s[i]

      if (!hasFilterBeforeLimit && firstTakeIndex !== -1 && processedCount >= minTakeLimit) {
        break
      }

      let current: unknown = entry
      let shouldYield = true
      let shouldDrop = false

      for (const op of this.o) {
        if (!shouldYield) break

        switch (op.type) {
          case OPERATION_FILTER:
            if (!op.predicate(current, processedCount)) {
              shouldYield = false
            }
            break

          case OPERATION_MAP:
            current = op.transform(current, processedCount)
            break

          case OPERATION_TAKE:
            break

          case OPERATION_DROP:
            if (droppedCount < dropCount) {
              shouldDrop = true
            }
            break
        }
      }

      processedCount++

      if (shouldDrop && droppedCount < dropCount) {
        droppedCount++
        continue
      }

      if (shouldYield) {
        yieldedCount++
        yield current as T
      }

      if (hasFilterBeforeLimit && yieldedCount >= minTakeLimit) {
        break
      }
    }
  }

  /**
   * Filters elements based on a predicate function
   *
   * 根据断言函数过滤元素
   *
   * @param predicate - The predicate function. 断言函数
   * @returns A new ArrayIterator instance with the filter operation. 带有过滤操作的新 ArrayIterator 实例
   *
   * @example
   * ```ts
   * new ArrayIterator([1, 2, 3, 4])
   *   .filter((v) => v > 2)
   *   .toArray()
   * // => [3, 4]
   * ```
   */
  filter(predicate: ArrayIteratorPredicate<T>): ArrayIterator<T> {
    if (!isFunction(predicate)) {
      throw new TypeError('predicate must be a function')
    }
    return ArrayIterator.create<T>(this.s, [
      ...this.o,
      {
        type: OPERATION_FILTER,
        predicate: predicate as (value: unknown, index: number) => boolean,
      },
    ])
  }

  /**
   * Transforms elements using a transform function
   *
   * 使用转换函数转换元素
   *
   * @typeParam R - The type of transformed elements. 转换后的元素类型
   * @param transform - The transform function. 转换函数
   * @returns A new ArrayIterator instance with the map operation. 带有映射操作的新 ArrayIterator 实例
   *
   * @example
   * ```ts
   * new ArrayIterator([1, 2, 3])
   *   .map((v) => v * 2)
   *   .toArray()
   * // => [2, 4, 6]
   * ```
   */
  map<R>(transform: ArrayIteratorTransform<T, R>): ArrayIterator<R> {
    if (!isFunction(transform)) {
      throw new TypeError('transform must be a function')
    }
    return ArrayIterator.create<R>(this.s, [
      ...this.o,
      { type: OPERATION_MAP, transform: transform as (value: unknown, index: number) => unknown },
    ])
  }

  /**
   * Takes the first N elements
   *
   * 获取前 N 个元素
   *
   * @param limit - The maximum number of elements to take. 要获取的最大元素数
   * @returns A new ArrayIterator instance with the take operation. 带有获取操作的新 ArrayIterator 实例
   *
   * @example
   * ```ts
   * new ArrayIterator([1, 2, 3, 4, 5])
   *   .take(3)
   *   .toArray()
   * // => [1, 2, 3]
   * ```
   */
  take(limit: number): ArrayIterator<T> {
    if (!isNumber(limit) || !isInteger(limit) || limit < 0) {
      throw new TypeError('limit must be a non-negative integer')
    }
    return ArrayIterator.create<T>(this.s, [...this.o, { type: OPERATION_TAKE, limit }])
  }

  /**
   * Drops the first N elements
   *
   * 跳过前 N 个元素
   *
   * @param count - The number of elements to drop. 要跳过的元素数量
   * @returns A new ArrayIterator instance with the drop operation. 带有跳过操作的新 ArrayIterator 实例
   *
   * @example
   * ```ts
   * new ArrayIterator([1, 2, 3, 4, 5])
   *   .drop(2)
   *   .toArray()
   * // => [3, 4, 5]
   * ```
   */
  drop(count: number): ArrayIterator<T> {
    if (!isNumber(count) || !isInteger(count) || count < 0) {
      throw new TypeError('count must be a non-negative integer')
    }
    return ArrayIterator.create<T>(this.s, [...this.o, { type: OPERATION_DROP, count }])
  }

  /**
   * Executes a provided callback function once for each array element
   *
   * 对数组中的每个元素执行一次提供的回调函数
   *
   * @param callback - The function to execute for each element. 为每个元素执行的函数
   *
   * @example
   * ```ts
   * new ArrayIterator([1, 2, 3])
   *   .forEach((value, index) => console.log(value, index))
   * ```
   */
  forEach(callback: ArrayIteratorCallback<T>): void {
    if (!isFunction(callback)) {
      throw new TypeError('callback must be a function')
    }
    let index = 0
    for (const value of this.iterate()) {
      callback(value, index++)
    }
  }

  /**
   * Tests whether all elements pass the test implemented by the provided function
   *
   * 测试所有元素是否都通过了由提供的函数实现的测试
   *
   * @param predicate - The function to test for each element. 用于测试每个元素的函数
   * @returns true if all elements pass the test, false otherwise. 如果所有元素都通过测试则返回 true，否则返回 false
   *
   * @example
   * ```ts
   * new ArrayIterator([2, 4, 6]).every((v) => v % 2 === 0)
   * // => true
   * ```
   */
  every(predicate: ArrayIteratorPredicate<T>): boolean {
    if (!isFunction(predicate)) {
      throw new TypeError('predicate must be a function')
    }
    let index = 0
    for (const value of this.iterate()) {
      if (!predicate(value, index++)) {
        return false
      }
    }
    return true
  }

  /**
   * Tests whether at least one element passes the test implemented by the provided function
   *
   * 测试是否至少有一个元素通过了由提供的函数实现的测试
   *
   * @param predicate - The function to test for each element. 用于测试每个元素的函数
   * @returns true if at least one element passes the test, false otherwise. 如果至少有一个元素通过测试则返回 true，否则返回 false
   *
   * @example
   * ```ts
   * new ArrayIterator([1, 2, 3]).some((v) => v % 2 === 0)
   * // => true
   * ```
   */
  some(predicate: ArrayIteratorPredicate<T>): boolean {
    if (!isFunction(predicate)) {
      throw new TypeError('predicate must be a function')
    }
    let index = 0
    for (const value of this.iterate()) {
      if (predicate(value, index++)) {
        return true
      }
    }
    return false
  }

  /**
   * Returns the value of the first element that satisfies the provided testing function
   *
   * 返回满足提供的测试函数的第一个元素的值
   *
   * @param predicate - The function to test for each element. 用于测试每个元素的函数
   * @returns The value of the first element that passes the test, or undefined if no element passes. 通过测试的第一个元素的值，如果没有元素通过则返回 undefined
   *
   * @example
   * ```ts
   * new ArrayIterator([1, 2, 3, 4]).find((v) => v > 2)
   * // => 3
   * ```
   */
  find(predicate: ArrayIteratorPredicate<T>): T | undefined {
    if (!isFunction(predicate)) {
      throw new TypeError('predicate must be a function')
    }
    let index = 0
    for (const value of this.iterate()) {
      if (predicate(value, index++)) {
        return value
      }
    }
    return undefined
  }

  /**
   * Executes all chained operations and returns the final result array
   *
   * 执行所有链式操作并返回最终结果数组
   *
   * @returns An array of the processed elements. 处理后的元素数组
   *
   * @example
   * ```ts
   * new ArrayIterator([1, 2, 3]).toArray()
   * // => [1, 2, 3]
   * ```
   */
  toArray(): T[] {
    return [...this.iterate()]
  }

  /**
   * Implements the iterable protocol, allowing ArrayIterator to be used
   * in for...of loops, spread operator, and other iterable consumers
   *
   * 实现可迭代协议，允许 ArrayIterator 用于 for...of 循环、展开运算符及其他可迭代消费者
   *
   * @returns An iterator for the processed elements. 处理后元素的迭代器
   *
   * @example
   * ```ts
   * const iterator = new ArrayIterator([1, 2, 3])
   * for (const value of iterator) {
   *   console.log(value)
   * }
   * ```
   */
  [Symbol.iterator](): Generator<T> {
    return this.iterate()
  }
}
