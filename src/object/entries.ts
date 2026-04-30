/**
 * Strict typed `Object.entries`
 *
 * 严格类型的 `Object.entries`
 *
 * @category Object
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param obj - The object to get entries from. 要获取键值对的对象
 * @returns An array of key-value pairs. 键值对数组
 *
 * @see {@link objectKeys} — for typed Object.keys
 * @see {@link objectKeys} — 类型安全的 Object.keys
 *
 * @example
 * ```ts
 * objectEntries({ a: 1, b: 2 }) // => [['a', 1], ['b', 2]]
 * ```
 */
export function objectEntries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}
