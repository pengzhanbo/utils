import { objectMap } from './map.js'

/**
 * Maps the keys of an object and constructs a new object with the mapped keys.
 *
 * Only own enumerable string keys are processed; symbol keys are ignored.
 * The input object is not mutated.
 *
 * 映射对象的键，并构造一个具有映射后键的新对象。
 *
 * 仅处理自身可枚举的字符串键，符号键会被忽略。不会修改输入对象。
 *
 * @category Object
 *
 * @typeParam K - The type of the keys in the source object. 源对象中键的类型
 * @typeParam V - The type of the values. 值的类型
 * @param obj - The source object. 源对象
 * @param fn - The function to transform each key. 用于转换每个键的函数
 * @returns A new object with mapped keys and the original values. 具有映射后键和原值的新对象
 *
 * @remarks
 * When multiple keys map to the same result key, the later entry wins (later
 * entries overwrite earlier ones), following `Object.fromEntries` order.
 * Mapped keys are created as own data properties, so mapping to `__proto__`
 * does not cause prototype pollution.
 *
 * 当多个键映射到同一个结果键时，后面的条目会覆盖前面的条目
 * （遵循 `Object.fromEntries` 的顺序）。映射后的键作为自身数据属性创建，
 * 因此映射到 `__proto__` 不会导致原型污染。
 *
 * @example
 * ```ts
 * mapKeys({ a: 1, b: 2 }, (k) => k.toUpperCase())
 * // => { A: 1, B: 2 }
 * ```
 *
 * @example
 * ```ts
 * mapKeys({ a: 1, b: 2 }, () => 'x')
 * // => { x: 2 }
 * ```
 */
export function mapKeys<K extends PropertyKey, V>(
  obj: Record<K, V>,
  fn: (key: K, value: V) => PropertyKey,
): Record<PropertyKey, V> {
  return objectMap(obj, (key, value) => [fn(key as K, value), value])
}
