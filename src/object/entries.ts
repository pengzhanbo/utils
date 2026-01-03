/**
 * Strict typed `Object.entries`
 *
 * 严格类型的 `Object.entries`
 *
 * @category Object
 * @example
 * ```ts
 * objectEntries({ a: 1, b: 2 }) // => [['a', 1], ['b', 2]]
 * ```
 */
export function objectEntries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}
