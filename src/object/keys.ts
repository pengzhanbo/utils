/**
 * Strict typed `Object.keys`
 *
 * 严格类型的 `Object.keys`
 *
 * @category Object
 *
 * @param obj - The object to get keys from. 要获取键的对象
 * @returns An array of the object's own enumerable property keys. 对象自身可枚举属性键的数组
 *
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
