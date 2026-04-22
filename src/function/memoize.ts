import type { Fn } from '../types'

export interface MemoizeOptions {
  /**
   * Maximum number of cached entries.
   * 缓存条目最大数量
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
  keyResolver?: Fn<string>
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
 * @param func - The function to memoize. 要记忆化的函数
 * @param options - Options for memoization. 记忆化配置
 * @param options.maxSize
 * @param options.ttl
 * @param options.keyResolver
 * @returns A memoized version of the function. 记忆化后的函数
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
export function memoize<T extends Fn>(func: T, options?: MemoizeOptions): MemoizedFn<T> {
  const { maxSize, ttl, keyResolver } = options ?? {}

  const cache = new Map<string, CacheValue>()
  const keys: string[] = []

  const memoized = (...args: Parameters<T>): ReturnType<T> => {
    const key = keyResolver ? keyResolver(...args) : JSON.stringify(args)

    const entry = cache.get(key)
    if (entry) {
      if (ttl === undefined || Date.now() - entry.timestamp < ttl) {
        return entry.value
      }
      cache.delete(key)
    }

    const value = func(...args)

    cache.set(key, { value, timestamp: Date.now() })
    keys.push(key)

    if (maxSize !== undefined && cache.size > maxSize) {
      const oldest = keys.shift()
      if (oldest) cache.delete(oldest)
    }

    return value
  }

  memoized.clear = () => {
    cache.clear()
    keys.length = 0
  }

  return memoized as MemoizedFn<T>
}
