import { copyDataKey, copyOwnDataProperties } from '../_internal/copy-data-key.js'
import { del } from '../_internal/reflect.js'
import { hasOwn } from './has-own.js'
import { objectKeys } from './keys.js'

/**
 * Creates a new object with specified keys omitted.
 *
 * 创建一个新对象，省略指定的键。
 *
 * @category Object
 *
 * @see {@link pick} and {@link pickBy} — for the inverse operation
 * @see {@link pick} 和 {@link pickBy} — 反向操作
 *
 * @param obj - The source object. 源对象
 * @param keys - The keys to omit. 要省略的键
 * @returns A new object with the specified keys omitted. 省略了指定键的新对象
 *
 * @remarks
 * An own `__proto__` key is ignored, so untrusted input can neither replace the prototype of the
 * result nor smuggle the key into a later `Object.assign`-style merge.
 *
 * 源对象自有的 `__proto__` 键会被忽略，避免不可信输入替换结果原型、或把该键带入后续
 * `Object.assign` 式合并再次触发污染。
 *
 * @example
 * ```ts
 * omit({ a: 1, b: 2 }, ['a']) // => { b: 2 }
 * ```
 * @typeParam T - The type of the source object / 源对象类型
 */
export function omit<T extends Record<PropertyKey, any>, K extends keyof T = keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const res = Object.create(Object.getPrototypeOf(obj) as object) as T

  copyOwnDataProperties(res, obj)

  for (const key of keys) {
    if (hasOwn(obj, key)) {
      del(res, key)
    }
  }

  return res
}

/**
 * Creates a new object with properties that do not satisfy the predicate.
 *
 * 创建一个新对象，排除满足 predicate 的属性
 *
 * @category Object
 *
 * @typeParam T - The type of the source object / 源对象类型
 * @param obj - The source object. 源对象
 * @param predicate - The predicate function. 谓词函数
 * @returns A new object without properties that satisfy the predicate. 排除满足谓词属性的新对象
 *
 * @remarks
 * An own `__proto__` key is ignored, so untrusted input can neither replace the prototype of the
 * result.
 *
 * 源对象自有的 `__proto__` 键会被忽略，避免不可信输入替换结果原型。
 *
 * @example
 * ```ts
 * omitBy({ a: 1, b: 2, c: 3 }, (v) => v > 1) // => { a: 1 }
 * ```
 */
export function omitBy<T extends Record<PropertyKey, any>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const res: Partial<T> = Object.create(Object.getPrototypeOf(obj) as object) as Partial<T>

  for (const key of objectKeys(obj)) {
    if (!predicate(obj[key], key)) {
      copyDataKey(res, key, obj[key])
    }
  }

  return res
}
