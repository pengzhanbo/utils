/**
 * Strict typed `Object.keys`
 *
 * 严格类型的 `Object.keys`
 *
 * @category Object
 * @example
 * ```ts
 * objectKeys({ a: 1, b: 2 }) // => ['a', 'b']
 * ```
 */
export function objectKeys<T extends object>(
  obj: T,
): Array<`${keyof T & (string | number | boolean | null | undefined)}`> {
  return Object.keys(obj) as Array<`${keyof T & (string | number | boolean | null | undefined)}`>
}
