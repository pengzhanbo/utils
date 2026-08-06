import { objectMap } from './map.js'

/**
 * Inverts the keys and values of an object.
 *
 * Only own enumerable string keys are processed; symbol keys are ignored.
 * The input object is not mutated.
 *
 * 反转对象的键和值。
 *
 * 仅处理自身可枚举的字符串键，符号键会被忽略。不会修改输入对象。
 *
 * @category Object
 *
 * @typeParam K - The type of the keys in the source object. 源对象中键的类型
 * @typeParam V - The type of the values, which become the keys of the result. 值的类型，将成为结果对象的键
 * @param obj - The source object. 源对象
 * @returns A new object with keys and values swapped. 键和值互换后的新对象
 *
 * @remarks
 * When multiple keys share the same value, the later key wins in the result.
 * Symbol values become symbol keys (supported by `Object.fromEntries`).
 *
 * 当多个键拥有相同的值时，后面的键会胜出。符号值会成为符号键
 * （`Object.fromEntries` 支持符号键）。
 *
 * @example
 * ```ts
 * invert({ a: 1, b: 2 })
 * // => { 1: 'a', 2: 'b' }
 * ```
 */
export function invert<K extends PropertyKey, V extends PropertyKey>(
  obj: Record<K, V>,
): Record<V, K> {
  return objectMap(obj, (key, value) => [value, key]) as Record<V, K>
}
