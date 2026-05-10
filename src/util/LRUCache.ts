import { timestamp } from '../date'
import { isFunction, isNumber } from '../predicate'

/**
 * LRU Cache Options
 *
 * LRU 缓存选项
 */
export interface LRUCacheOptions<K, V> {
  /**
   * The target maximum number of items before evicting the least recently used items.
   *
   * 驱逐最近最少使用项之前的目标最大项目数。
   */
  maxSize: number
  /**
   * The maximum number of milliseconds an item should remain in the cache.
   *
   * By default, `maxAge` will be `Infinity`, which means that items will never expire.
   * Lazy expiration occurs upon the next write or read call.
   *
   * Individual expiration of an item can be specified with the `set(key, value, {maxAge})` method.
   *
   * 一个项目在缓存中保留的最大毫秒数。
   *
   * 默认情况下，`maxAge` 为 `Infinity`，这意味着项目永不过期。
   * 惰性过期发生在下一次写入或读取调用时。
   *
   * 可以通过 `set(key, value, {maxAge})` 方法指定单个项目的过期时间。
   *
   * @default Infinity
   */
  maxAge?: number

  /**
   * Called right before an item is evicted from the cache due to LRU pressure, TTL expiration, or manual eviction via `evict()`.
   *
   * Useful for side effects or for items like object URLs that need explicit cleanup (`revokeObjectURL`).
   *
   * 在项目因LRU压力、TTL过期或通过`evict()`手动驱逐而即将从缓存中移除时调用。
   *
   * 适用于需要执行副作用操作或需要显式清理的对象URL（如`revokeObjectURL`）等场景。
   *
   * @param key The key of the item being evicted.  被驱逐的项目的键。
   * @param value The value of the item being evicted. 被驱逐的项目的值。
   */
  onEviction?: (key: K, value: V) => void
}

interface LRUCacheItem<V> {
  value: V
  expiry?: number
}

type InternalLRUCache<K, V> = Map<K, LRUCacheItem<V>>

/**
 * LRU Cache Set Options
 *
 * LRU 缓存 Set 选项
 */
export interface LRUCacheSetOptions {
  /**
   * The maximum number of milliseconds an item should remain in the cache.
   *
   * 项目在缓存中保留的最大毫秒数。
   *
   * @default Infinity
   */
  maxAge?: number
}

/**
 * LRU Cache
 *
 * @category Util
 * @typeParam K  item key type  项目的键的类型
 * @typeParam V  item value type  项目的值的类型
 *
 * @example
 * ```ts
 * const cache = new LRUCache({ maxSize: 10 })
 * cache.set('a', 1)
 * cache.set('b', 2)
 * cache.get('a') // 1
 * cache.get('b') // 2
 * cache.size // 2
 * cache.maxSize // 10
 * cache.has('a') // true - item exists 项目是否存在
 * cache.peek('a') // 1 - (not marked as recently used) (不标记为最近使用)
 * cache.evict(1) // Delete the least recently used item.  删除最近最少使用的一项
 * ```
 */
export class LRUCache<K, V> extends Map<K, V> implements Iterable<[K, V]> {
  #maxSize: number
  #maxAge: number
  #size: number

  #onEviction?: (key: K, value: V) => void
  #cache: InternalLRUCache<K, V> = new Map()
  #oldCache: InternalLRUCache<K, V> = new Map()

  constructor(options: LRUCacheOptions<K, V>) {
    super()

    if (!(options.maxSize && options.maxSize > 0)) {
      throw new TypeError('`maxSize` must be a number greater than 0')
    }

    if (typeof options.maxAge === 'number' && options.maxAge === 0) {
      throw new TypeError('`maxAge` must be a number greater than 0')
    }

    this.#maxSize = options.maxSize
    this.#maxAge = options.maxAge || Number.POSITIVE_INFINITY
    this.#size = 0
    this.#onEviction = options.onEviction
  }

  override *[Symbol.iterator](): MapIterator<[K, V]> {
    for (const item of this.#cache) {
      const [key, value] = item
      const deleted = this.#deleteIfExpired(key, value)
      if (deleted === false) {
        yield [key, value.value]
      }
    }

    for (const item of this.#oldCache) {
      const [key, value] = item
      if (!this.#cache.has(key)) {
        const deleted = this.#deleteIfExpired(key, value)
        if (deleted === false) {
          yield [key, value.value]
        }
      }
    }
  }

  /**
   * Set an item. Returns the instance.
   *
   * Individual expiration of an item can be specified with the `maxAge` option.
   * If not specified, the global `maxAge` value will be used in case
   * it is specified in the constructor; otherwise the item will never expire.
   *
   * 设置一个项目。返回实例。
   *
   * 可以使用 `maxAge` 选项指定单个项目的过期时间。
   * 如果未指定，当构造函数中指定了全局 `maxAge` 值时，将使用该值；否则项目永不过期。
   *
   * @param key item key  项目的键
   * @param value item value  项目的值
   * @param options item options  项目的选项
   * @param options.maxAge item max age  项目的在缓存中保留的最大毫秒数
   * @returns instance  实例
   */
  override set(key: K, value: V, options?: LRUCacheSetOptions): this {
    const maxAge = options?.maxAge || this.#maxAge
    const expiry =
      isNumber(maxAge) && maxAge !== Number.POSITIVE_INFINITY ? timestamp() + maxAge : undefined

    if (this.#cache.has(key)) {
      this.#cache.set(key, {
        value,
        expiry,
      })
    } else {
      this.#set(key, { value, expiry })
    }
    return this
  }

  /**
   * Get an item. Returns the value if the item exists, or undefined if it does not.
   *
   * 获取一个项目。如果项目存在，则返回项目的值；否则返回 `undefined`。
   *
   * @param key item key  项目的键
   * @returns item value  项目的值
   */
  override get(key: K): V | undefined {
    if (this.#cache.has(key)) {
      const item = this.#cache.get(key)!
      return this.#getItemValue(key, item)
    }

    if (this.#oldCache.has(key)) {
      const item = this.#oldCache.get(key)!
      if (this.#deleteIfExpired(key, item) === false) {
        this.#moveToRecent(key, item)
        return item.value
      }
    }
  }

  /**
   * Check if an item exists.
   *
   * 检查项目是否存在。
   *
   * @param key item key  项目的键
   * @returns boolean  项目是否存在
   */
  override has(key: K): boolean {
    if (this.#cache.has(key)) {
      return !this.#deleteIfExpired(key, this.#cache.get(key)!)
    }

    if (this.#oldCache.has(key)) {
      return !this.#deleteIfExpired(key, this.#oldCache.get(key)!)
    }

    return false
  }

  /**
   * Get an item without marking it as recently used.
   *
   * 获取一个项目，不将其标记为最近使用。
   *
   * @param key item key  项目的键
   * @returns item value  项目的值
   */
  peek(key: K): V | undefined {
    if (this.#cache.has(key)) {
      return this.#peek(key, this.#cache)
    }

    if (this.#oldCache.has(key)) {
      return this.#peek(key, this.#oldCache)
    }
  }

  /**
   * Delete an item.
   *
   * 删除一个项目。
   *
   * @param key item key  项目的键
   * @returns boolean  是否成功删除项目
   */
  override delete(key: K): boolean {
    const deleted = this.#cache.delete(key)
    if (deleted) {
      this.#size--
    }

    return this.#oldCache.delete(key) || deleted
  }

  /**
   * Clear the cache.
   *
   * 清空缓存。
   */
  override clear(): void {
    this.#cache.clear()
    this.#oldCache.clear()
    this.#size = 0
  }

  /**
   * Get the remaining time to live (in milliseconds) for the given item, or `undefined` when the item is not in the cache.
   * - Does not mark the item as recently used.
   * - Does not trigger lazy expiration or remove the entry when it is expired.
   * - Returns `Infinity` if the item has no expiration.
   * - May return a negative number if the item is already expired but not yet lazily removed.
   * 
   * 获取指定项目的剩余存活时间（以毫秒为单位），如果项目不在缓存中则返回 `undefined`。
   * - 不会将该项目标记为最近使用。
   * - 不会触发惰性过期，也不会在项目过期时移除该条目。
   * - 如果项目没有过期时间，则返回 `Infinity`。
   * - 如果项目已过期但尚未被惰性移除，可能会返回负数。

   * @param key item key 项目的键
   * @returns Remaining time to live in milliseconds when set, `Infinity` when there is no expiration, or `undefined` when the item does not exist. 设置后剩余的存活时间（毫秒），若无过期时间则为`Infinity`，若项目不存在则为`undefined`。
   */
  expiresIn(key: K): number | undefined {
    const item = this.#cache.get(key) ?? this.#oldCache.get(key)
    if (item) {
      return item.expiry ? item.expiry - timestamp() : Number.POSITIVE_INFINITY
    }
  }

  /**
   * Update the `maxSize` in-place, discarding items as necessary. Insertion order is mostly preserved, though this is not a strong guarantee.
   * Useful for on-the-fly tuning of cache sizes in live systems.
   *
   * 就地更新 `maxSize`，必要时丢弃项目。插入顺序基本保留，但这不是一个强保证。
   * 适用于在线系统中动态调整缓存大小。
   *
   * @param size cache size 缓存大小
   */
  resize(size?: number): void {
    if (!(size && size > 0)) {
      throw new TypeError('`maxSize` must be a number greater than 0')
    }

    const items = [...this.#entriesAscending()]
    const removeCount = items.length - size
    if (removeCount < 0) {
      this.#cache = new Map(items)
      this.#oldCache = new Map()
      this.#size = items.length
    } else {
      if (removeCount > 0) {
        this.#emitEvictions(items.slice(0, removeCount))
      }

      this.#oldCache = new Map(items.slice(removeCount))
      this.#cache = new Map()
      this.#size = 0
    }

    this.#maxSize = size
  }

  /**
   * The stored item count. 缓存中存储的项目数量。
   */
  get size(): number {
    if (!this.#size) {
      return this.#oldCache.size
    }

    let oldCacheSize = 0
    for (const key of this.#oldCache.keys()) {
      if (!this.#cache.has(key)) {
        oldCacheSize++
      }
    }

    return Math.min(this.#size + oldCacheSize, this.#maxSize)
  }

  /**
   * The maximum size of the cache. 缓存的最大大小。
   */
  get maxSize(): number {
    return this.#maxSize
  }

  /**
   * The maximum age of items in the cache. 缓存中项目的最大年龄（毫秒）。
   */
  get maxAge(): number {
    return this.#maxAge
  }

  /**
   * Iterable for all the keys. 所有键的迭代器。
   */
  override *keys(): MapIterator<K> {
    for (const [key] of this) {
      yield key
    }
  }

  /**
   * Iterable for all the values. 所有值的迭代器。
   */
  override *values(): MapIterator<V> {
    for (const [, value] of this) {
      yield value
    }
  }

  /**
   * Iterable for all the entries. 所有条目的迭代器。
   */
  override *entries(): MapIterator<[K, V]> {
    for (const [key, value] of this.#entriesAscending()) {
      yield [key, value.value]
    }
  }

  *entriesAscending(): IterableIterator<[K, V]> {
    for (const [key, value] of this.#entriesAscending()) {
      yield [key, value.value]
    }
  }

  *entriesDescending(): IterableIterator<[K, V]> {
    let items = [...this.#cache]
    for (let i = items.length - 1; i >= 0; --i) {
      const item = items[i]!
      const [key, value] = item
      const deleted = this.#deleteIfExpired(key, value)
      if (deleted === false) {
        yield [key, value.value]
      }
    }

    items = [...this.#oldCache]
    for (let i = items.length - 1; i >= 0; --i) {
      const item = items[i]!
      const [key, value] = item
      if (!this.#cache.has(key)) {
        const deleted = this.#deleteIfExpired(key, value)
        if (deleted === false) {
          yield [key, value.value]
        }
      }
    }
  }

  // @ts-expect-error 重写 forEach 方法
  override forEach(
    callback: (value: LRUCacheItem<V>, key: K, map: LRUCache<K, V>) => void,
    thisArgument: LRUCache<K, V> = this,
  ): void {
    for (const [key, value] of this.#entriesAscending()) {
      callback.call(thisArgument, value, key, this)
    }
  }

  get [Symbol.toStringTag](): string {
    return 'LRUCache'
  }

  toString(): string {
    return `LRUCache(${this.size}/${this.maxSize})`
  }

  /**
   * Evict the least recently used items from the cache.
   *
   * It will always keep at least one item in the cache.
   *
   * 从缓存中移除最近最少使用的项目。
   *
   * 缓存中始终至少保留一个项目。
   *
   * @param count The number of items to evict. Defaults to 1. 移除的项目数量。默认值为 1。
   */
  evict(count?: number): void {
    const requested = Number(count)
    if (!requested || requested <= 0) {
      return
    }

    const items = [...this.#entriesAscending()]
    const evictCount = Math.trunc(Math.min(requested, Math.max(items.length - 1, 0)))
    if (evictCount <= 0) {
      return
    }

    this.#emitEvictions(items.slice(0, evictCount))
    this.#oldCache = new Map(items.slice(evictCount))
    this.#cache = new Map()
    this.#size = 0
  }

  #emitEvictions(cache: InternalLRUCache<K, V> | (readonly [K, LRUCacheItem<V>])[]) {
    if (!isFunction(this.#onEviction)) {
      return
    }

    for (const [key, item] of cache) {
      this.#onEviction(key, item.value)
    }
  }

  #deleteIfExpired(key: K, item: LRUCacheItem<V>): boolean {
    if (isNumber(item.expiry) && item.expiry <= timestamp()) {
      isFunction(this.#onEviction) && this.#onEviction(key, item.value)
      return this.delete(key)
    }
    return false
  }

  #getOrDeleteIfExpired(key: K, item: LRUCacheItem<V>): V | undefined {
    const deleted = this.#deleteIfExpired(key, item)
    if (deleted === false) {
      return item.value
    }
  }

  #getItemValue(key: K, item: LRUCacheItem<V>): V | undefined {
    return item.expiry ? this.#getOrDeleteIfExpired(key, item) : item.value
  }

  #peek(key: K, cache: Map<K, LRUCacheItem<V>>): V | undefined {
    const item = cache.get(key)!
    return this.#getItemValue(key, item)
  }

  #set(key: K, value: LRUCacheItem<V>) {
    this.#cache.set(key, value)
    this.#size++

    if (this.#size >= this.#maxSize) {
      this.#size = 0
      this.#emitEvictions(this.#oldCache)
      this.#oldCache = this.#cache
      this.#cache = new Map()
    }
  }

  #moveToRecent(key: K, item: LRUCacheItem<V>) {
    this.#oldCache.delete(key)
    this.#set(key, item)
  }

  *#entriesAscending() {
    for (const item of this.#oldCache) {
      const [key, value] = item
      if (!this.#cache.has(key)) {
        const deleted = this.#deleteIfExpired(key, value)
        if (deleted === false) {
          yield item
        }
      }
    }

    for (const item of this.#cache) {
      const [key, value] = item
      const deleted = this.#deleteIfExpired(key, value)
      if (deleted === false) {
        yield item
      }
    }
  }
}
