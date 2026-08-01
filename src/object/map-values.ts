import { objectMap } from './map'

/**
 * Maps the values of an object and constructs a new object with the same keys.
 *
 * Only own enumerable string keys are processed; symbol keys are ignored.
 * The input object is not mutated.
 *
 * 映射对象的值，并构造一个具有相同键的新对象。
 *
 * 仅处理自身可枚举的字符串键，符号键会被忽略。不会修改输入对象。
 *
 * @category Object
 *
 * @typeParam T - The type of the values in the source object. 源对象中值的类型
 * @typeParam U - The type of the values in the result object. 结果对象中值的类型
 * @param obj - The source object. 源对象
 * @param fn - The function to transform each value. 用于转换每个值的函数
 * @returns A new object with the same keys and transformed values. 具有相同键和转换后值的新对象
 *
 * @remarks
 * All keys are preserved, including dangerous keys such as `__proto__`. Keys
 * are created as own data properties via `Object.fromEntries`, so no prototype
 * pollution occurs.
 *
 * 所有键都会被保留，包括 `__proto__` 等危险键。键通过 `Object.fromEntries`
 * 作为自身数据属性创建，因此不会发生原型污染。
 *
 * @example
 * ```ts
 * mapValues({ a: 1, b: 2 }, (v) => v * 2)
 * // => { a: 2, b: 4 }
 * ```
 *
 * @example
 * ```ts
 * mapValues({ a: 1, b: 2 }, (v, k) => k + v)
 * // => { a: 'a1', b: 'b2' }
 * ```
 */
export function mapValues<T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => U,
): Record<string, U> {
  return objectMap(obj, (key, value) => [key, fn(value, key)]) as Record<string, U>
}
