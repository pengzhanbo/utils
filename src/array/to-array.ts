import type { Arrayable, Nullable } from '../types'
import { isArray } from '../predicate'

/**
 * Convert `Arrayable<T>` to `Array<T>`
 *
 * 将 `Arrayable<T>` 转换为 `Array<T>`
 *
 * @category Array
 *
 * @param v - The value to convert to array / 要转换为数组的值
 * @returns The array / 数组
 *
 * @example
 * ```ts
 * toArray(null) // => []
 * toArray(undefined) // => []
 * toArray([]) // => []
 * toArray(1) // => [1]
 * toArray([1]) // => [1]
 * ```
 */
export function toArray<T>(v: Nullable<Arrayable<T>>): T[] {
  if (v === null || v === undefined) return []
  if (isArray(v)) return v
  return [v]
}
