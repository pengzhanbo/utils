import { OPERATION_FILTER, OPERATION_MAP } from '../_internal/iterator'
import { isFunction } from '../predicate'
import { objectEntries } from './entries'

/**
 * Predicate function type for filtering object entries
 *
 * 用于过滤对象条目的断言函数类型
 */
export type ObjectIteratorPredicate<K extends string, V> = (key: K, value: V) => boolean

/**
 * Transform function type for mapping object entries
 *
 * 用于映射对象条目的转换函数类型
 */
export type ObjectIteratorTransform<K extends string, V, NK extends PropertyKey, NV> = (
  key: K,
  value: V,
) => [NK, NV]

/**
 * Operation type for lazy evaluation (internal)
 *
 * 惰性计算的操作类型（内部使用）
 */
type Operation<K extends string, V> =
  | { type: 'filter'; predicate: (key: K, value: V) => boolean }
  | { type: 'map'; transform: (key: K, value: V) => [PropertyKey, unknown] }

/**
 * A lazy-evaluated iterator for objects with chainable operations
 *
 * 支持链式操作的惰性计算对象迭代器，使用 Generator 实现单次遍历
 *
 * @typeParam K - The key type of entries. 条目的键类型
 * @typeParam V - The value type of entries. 条目的值类型
 *
 * @category Object
 *
 * @example
 * ```ts
 * const result = new ObjectIterator({ a: 1, b: 2, c: 3 })
 *   .filter((k, v) => v > 1)
 *   .map((k, v) => [k.toUpperCase(), v * 2] as const)
 *   .toArray()
 * // => [['B', 4], ['C', 6]]
 * ```
 */
export class ObjectIterator<K extends string = string, V = unknown> {
  /**
   * The source object to iterate over. 要迭代的源对象
   */
  private readonly s: Array<[string, unknown]>
  /**
   * The list of operations to be applied lazily
   *
   * 要惰性应用的操作列表
   */
  private readonly o: Operation<string, unknown>[]

  /**
   * Creates a new ObjectIterator instance
   *
   * 创建一个新的 ObjectIterator 实例
   *
   * @param obj - The source object to iterate. 要迭代的源对象
   */
  constructor(obj: Record<K, V>) {
    this.s = objectEntries(obj)
    this.o = []
  }

  /**
   * Creates a new iterator with existing source and operations
   *
   * 使用源数据和操作创建新迭代器
   */
  private static create<K extends string, V>(
    source: Array<[string, unknown]>,
    operations: Operation<string, unknown>[],
  ): ObjectIterator<K, V> {
    const iterator = new ObjectIterator<K, V>({} as Record<K, V>)
    ;(iterator as unknown as { s: Array<[string, unknown]> }).s = source
    ;(iterator as unknown as { o: Operation<string, unknown>[] }).o = operations
    return iterator
  }

  /**
   * Creates a generator that applies all operations in a single pass
   *
   * 创建一个在单次遍历中应用所有操作的生成器
   */
  private *iterate(): Generator<[K, V]> {
    for (const entry of this.s) {
      let current: [PropertyKey, unknown] = entry
      let shouldYield = true

      for (const op of this.o) {
        if (!shouldYield) break

        switch (op.type) {
          case OPERATION_FILTER:
            if (!op.predicate(current[0] as string, current[1])) {
              shouldYield = false
            }
            break

          case OPERATION_MAP:
            current = op.transform(current[0] as string, current[1])
            break
        }
      }

      if (shouldYield) {
        yield current as [K, V]
      }
    }
  }

  /**
   * Filters entries based on a predicate function
   *
   * 根据断言函数过滤条目
   *
   * @param predicate - The predicate function. 断言函数
   * @returns A new ObjectIterator instance with the filter operation. 带有过滤操作的新 ObjectIterator 实例
   *
   * @example
   * ```ts
   * new ObjectIterator({ a: 1, b: 2 })
   *   .filter((k, v) => v > 1)
   *   .toArray()
   * // => [['b', 2]]
   * ```
   */
  filter(predicate: ObjectIteratorPredicate<K, V>): ObjectIterator<K, V> {
    if (!isFunction(predicate)) {
      throw new TypeError('predicate must be a function')
    }
    return ObjectIterator.create<K, V>(this.s, [
      ...this.o,
      { type: OPERATION_FILTER, predicate: predicate as (key: string, value: unknown) => boolean },
    ])
  }

  /**
   * Transforms entries using a transform function
   *
   * 使用转换函数转换条目
   *
   * @typeParam NK - The new key type after transformation. 转换后的新键类型
   * @typeParam NV - The new value type after transformation. 转换后的新值类型
   * @param transform - The transform function. 转换函数
   * @returns A new ObjectIterator instance with the map operation. 带有映射操作的新 ObjectIterator 实例
   *
   * @example
   * ```ts
   * new ObjectIterator({ a: 1, b: 2 })
   *   .map((k, v) => [k.toUpperCase(), v * 2] as const)
   *   .toArray()
   * // => [['A', 2], ['B', 4]]
   * ```
   */
  map<NK extends PropertyKey, NV>(
    transform: ObjectIteratorTransform<K, V, NK, NV>,
  ): ObjectIterator<NK extends string ? NK : string, NV> {
    if (!isFunction(transform)) {
      throw new TypeError('transform must be a function')
    }
    return ObjectIterator.create<NK extends string ? NK : string, NV>(this.s, [
      ...this.o,
      {
        type: OPERATION_MAP,
        transform: transform as unknown as (key: string, value: unknown) => [NK, NV],
      },
    ])
  }

  /**
   * Executes all chained operations and returns the final result array
   *
   * 执行所有链式操作并返回最终结果数组
   *
   * @returns An array of [key, value] pairs. [key, value] 对数组
   *
   * @example
   * ```ts
   * new ObjectIterator({ a: 1, b: 2 }).toArray()
   * // => [['a', 1], ['b', 2]]
   * ```
   */
  toArray(): Array<[K, V]> {
    return [...this.iterate()]
  }

  /**
   * Implements the iterable protocol, allowing ObjectIterator to be used
   * in for...of loops, spread operator, and other iterable consumers
   *
   * 实现可迭代协议，允许 ObjectIterator 用于 for...of 循环、展开运算符及其他可迭代消费者
   *
   * @returns An iterator for the processed entries. 处理后条目的迭代器
   *
   * @example
   * ```ts
   * // for...of loop
   * for (const [key, value] of new ObjectIterator({ a: 1, b: 2 })) {
   *   console.log(key, value)
   * }
   *
   * // spread operator
   * const entries = [...new ObjectIterator({ a: 1, b: 2 })]
   *
   * // Array.from
   * const arr = Array.from(new ObjectIterator({ a: 1, b: 2 }))
   * ```
   */
  [Symbol.iterator](): Generator<[K, V]> {
    return this.iterate()
  }
}
