/**
 * Strict typed `Object.keys`
 *
 * 严格类型的 `Object.keys`
 *
 * @category Object
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param obj - The object to get keys from. 要获取键的对象
 * @returns An array of the object's own enumerable property keys. 对象自身可枚举属性键的数组
 *
 * @see {@link objectEntries} — for typed Object.entries
 * @see {@link objectEntries} — 类型安全的 Object.entries
 *
 * @example
 * ```ts
 * objectKeys({ a: 1, b: 2 }) // => ['a', 'b']
 * ```
 */
export function objectKeys<T extends object>(obj: T): Array<`${keyof T & (string | number)}`> {
  return Object.keys(obj) as Array<`${keyof T & (string | number)}`>
}
