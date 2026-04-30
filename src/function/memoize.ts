import type { Fn } from '../types'
import { isUndefined } from '../predicate'

export interface MemoizeOptions<T extends Fn = Fn> {
  /**
   * Maximum number of cached entries.
   * 缓存条目最大数量
   * @typeParam Fn - The type of the function / 函数的类型
   * @typeParam T - The type of the function / 函数的类型
   */
  maxSize?: number
  /**
   * Time-to-live in milliseconds. If set, cache expires after this duration.
   * 缓存有效期（毫秒）。设置后缓存将在此时间后过期
   */
  ttl?: number
  /**
   * Custom key resolver. By default, arguments are serialized via JSON.
   * 自定义 key 生成器。默认使用 JSON 序列化参数
   */
  keyResolver?: (...args: Parameters<T>) => string
}

/**
 * Memoized function
 *
 * 记忆化后的函数
 */
export type MemoizedFn<T extends Fn> = T & {
  /**
   * Clear the memoization cache for this function.
   * 清除该函数的记忆化缓存
   */
  clear: () => void
}

type CacheValue = { readonly value: any; readonly timestamp: number }

/**
 * Memoize a function, caching its results based on arguments.
 * Supports max cache size and TTL (time-to-live) expiration.
 *
 * 记忆化函数，缓存基于参数的结果。支持最大缓存大小和 TTL 过期机制
 *
 * @category Function
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param func - The function to memoize. 要记忆化的函数
 * @param options - Options for memoization. 记忆化配置
 * @param options.maxSize
 * @param options.ttl
 * @param options.keyResolver
 * @returns A memoized version of the function. 记忆化后的函数
 *
 * @remarks
 * When neither `maxSize` nor `ttl` is set, the cache grows without bound.
 * For long-running applications, it is strongly recommended to set at least one of these
 * options to prevent memory leaks.
 *
 * 当 `maxSize` 和 `ttl` 都未设置时，缓存会无限增长。对于长期运行的应用，
 * 强烈建议至少设置其中一个选项以防止内存泄漏。
 *
 * The default key resolver uses `JSON.stringify`, which has limitations:
 * - Circular references will throw `TypeError`
 * - Object property order affects the key (`{a:1,b:2}` ≠ `{b:2,a:1}`)
 * - `undefined`, functions, and Symbols are ignored or converted to `null`
 * - Cannot distinguish certain types (`JSON.stringify([1])` vs `JSON.stringify({"0":1})`)
 * Use `keyResolver` for more robust key generation.
 *
 * 默认的 key 生成器使用 `JSON.stringify`，存在以下限制：
 * - 循环引用会抛出 `TypeError`
 * - 对象属性顺序影响 key（`{a:1,b:2}` ≠ `{b:2,a:1}`）
 * - `undefined`、函数和 Symbol 会被忽略或转为 `null`
 * - 无法区分某些类型。请使用 `keyResolver` 进行更健壮的 key 生成。
 *
 * @example
 * ```ts
 * const add = (a: number, b: number) => a + b
 * const memoizedAdd = memoize(add)
 * memoizedAdd(1, 2) // => 3, computed
 * memoizedAdd(1, 2) // => 3, cached
 * memoizedAdd(2, 1) // => 3, different args, computed
 * ```
 *
 * @example
 * With TTL (expires after 1000ms) / 缓存有效期（毫秒）。
 * ```ts
 * const fn = memoize(someExpensiveFn, { ttl: 1000 })
 * fn('key') // computed
 * fn('key') // cached (within TTL)
 * ```
 *
 * @example
 * With maxSize (LRU eviction when limit exceeded) / 最大缓存条目数量（LRU 缓存策略）
 * ```ts
 * const fn = memoize(someExpensiveFn, { maxSize: 100 })
 * ```
 *
 * @example
 * With custom key resolver / 自定义 key 生成器
 * ```ts
 * const fn = memoize(someExpensiveFn, {
 *   keyResolver: (a, b) => `${a}:${b}`
 * })
 * ```
 *
 * @example
 * Clear cache / 清除缓存
 * ```ts
 * const fn = memoize(someExpensiveFn)
 * fn('key') // computed
 * fn('key') // cached
 * fn.clear()
 * ```
 */
export function memoize<T extends Fn>(func: T, options?: MemoizeOptions<T>): MemoizedFn<T> {
  const { maxSize, ttl, keyResolver } = options ?? {}

  if (maxSize !== undefined && maxSize < 0)
    throw new RangeError('maxSize must be a non-negative integer')
  if (ttl !== undefined && ttl < 0) throw new RangeError('ttl must be a non-negative number')

  if (maxSize === 0) {
    const noCacheFn = function (this: any, ...args: Parameters<T>): ReturnType<T> {
      return func.apply(this, args)
    }
    noCacheFn.clear = () => {}
    return noCacheFn as MemoizedFn<T>
  }

  const cache = new Map<string, CacheValue>()

  const memoized = function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = keyResolver ? keyResolver(...args) : JSON.stringify(args)

    const entry = cache.get(key)
    if (entry) {
      if (isUndefined(ttl) || Date.now() - entry.timestamp < ttl) {
        cache.delete(key)
        cache.set(key, entry)
        return entry.value
      }
      cache.delete(key)
    }

    const value = func.apply(this, args)

    if (!isUndefined(maxSize) && cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value as string
      cache.delete(oldestKey)
    }

    cache.set(key, { value, timestamp: Date.now() })

    return value
  }

  memoized.clear = () => cache.clear()

  return memoized as MemoizedFn<T>
}
