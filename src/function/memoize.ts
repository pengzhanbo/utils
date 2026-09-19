import type { Fn } from '../types/index.js'
import { T_BOOLEAN, T_NUMBER, T_STRING } from '../_internal/tags.js'
import { isUndefined } from '../predicate/index.js'

export interface MemoizeOptions<T extends Fn = Fn> {
  /**
   * Maximum number of cached entries. When the limit is exceeded, the
   * least recently used entry is evicted (LRU). Cache hits refresh the
   * recency order.
   * 缓存条目最大数量。超出上限时淘汰最久未使用的条目（LRU）；命中会刷新使用顺序
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
   * Custom key resolver. By default, a fast key is generated for a single
   * `number`/`string`/`boolean` argument, and other arguments are serialized via JSON.
   * 自定义 key 生成器。默认情况下，单个 `number`/`string`/`boolean` 参数生成快速 key，其余参数使用 JSON 序列化
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

interface CacheValue {
  readonly value: any
  readonly timestamp: number
}

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
 * @param options.maxSize - Maximum number of cached entries. When the limit is exceeded, the least recently used entry is evicted (LRU). 缓存条目最大数量。超出上限时淘汰最久未使用的条目（LRU）
 * @param options.ttl - Time-to-live in milliseconds. If set, cache expires after this duration. 缓存有效期（毫秒）。设置后缓存将在此时间后过期
 * @param options.keyResolver - Custom key resolver. By default, a fast key is generated for a single `number`/`string`/`boolean` argument, and other arguments are serialized via JSON. 自定义 key 生成器。默认情况下，单个 `number`/`string`/`boolean` 参数生成快速 key，其余参数使用 JSON 序列化
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
 * Eviction is **LRU** (least recently used): a cache hit promotes the entry to the
 * most-recently-used position, and when `maxSize` is exceeded the least recently used
 * key is evicted, so frequently accessed values stay cached.
 *
 * 淘汰策略为 **LRU（最近最少使用）**：命中会把条目提升为最近使用，超出 `maxSize` 时
 * 淘汰最久未使用的 key，因此高频访问的值会保留在缓存中。
 *
 * The default key resolver generates a fast key (prefixed with the value type) for a single
 * `number`/`string`/`boolean` argument; other arguments fall back to `JSON.stringify`, which
 * has limitations:
 * - Circular references will throw `TypeError`
 * - Object property order affects the key (`{a:1,b:2}` ≠ `{b:2,a:1}`)
 * - `undefined`, functions, and Symbols are ignored or converted to `null`
 * - Cannot distinguish certain types (`JSON.stringify([1])` vs `JSON.stringify({"0":1})`)
 * Use `keyResolver` for more robust key generation.
 *
 * 默认的 key 生成器对单个 `number`/`string`/`boolean` 参数生成快速 key（带类型前缀）；
 * 其余参数回退到 `JSON.stringify`，存在以下限制：
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
 * With maxSize (LRU eviction when limit exceeded) / 最大缓存条目数量（超出上限时 LRU 淘汰）
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

  if (maxSize !== undefined && maxSize < 0) {
    throw new RangeError('maxSize must be a non-negative integer')
  }
  if (ttl !== undefined && ttl < 0) {
    throw new RangeError('ttl must be a non-negative number')
  }

  if (maxSize === 0) {
    const noCacheFn = function (this: any, ...args: Parameters<T>): ReturnType<T> {
      return func.apply(this, args)
    }
    noCacheFn.clear = (): void => {}
    return noCacheFn as MemoizedFn<T>
  }

  const cache = new Map<string, CacheValue>()
  const maxAge = isUndefined(ttl) ? Number.POSITIVE_INFINITY : ttl

  const memoized = function (this: any, ...args: Parameters<T>): ReturnType<T> {
    let key: string
    if (keyResolver) {
      key = keyResolver(...args)
    } else if (args.length === 1) {
      const arg = args[0] as number | string | boolean
      const type = typeof arg
      key =
        type === T_NUMBER || type === T_STRING || type === T_BOOLEAN
          ? `${type[0]}:${arg}`
          : JSON.stringify(args)
    } else {
      key = JSON.stringify(args)
    }

    const entry = cache.get(key)
    if (entry !== undefined) {
      // `maxAge` is precomputed: when no TTL is configured it stays `Infinity`,
      // so the cheap identity check skips the `Date.now()` call on the hot path.
      if (maxAge === Number.POSITIVE_INFINITY || Date.now() - entry.timestamp < maxAge) {
        // LRU: promote the hit to the most-recently-used position
        cache.delete(key)
        cache.set(key, entry)
        return entry.value
      }
      cache.delete(key)
    }

    const value = func.apply(this, args) as ReturnType<T>

    if (!isUndefined(maxSize) && cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value as string
      cache.delete(oldestKey)
    }

    cache.set(key, { value, timestamp: Date.now() })

    return value
  }

  memoized.clear = (): void => cache.clear()

  return memoized as MemoizedFn<T>
}
