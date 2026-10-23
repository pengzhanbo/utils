import { PROTO_KEY } from './tags.js'

/**
 * Copies one key of untrusted data onto `target`, ignoring the `__proto__` trap.
 *
 * 把不可信数据的一个键复制到 `target`，并忽略 `__proto__` 陷阱。
 *
 * @param target - The object to write to. 目标对象
 * @param key - The property key to copy. 要复制的属性键
 * @param value - The value to copy. 要复制的值
 *
 * @internal
 */
export function copyDataKey(target: object, key: PropertyKey, value: unknown): void {
  if (key === PROTO_KEY) {
    return
  }

  const record = target as Record<PropertyKey, unknown>
  record[key] = value
}

/**
 * Copies the own enumerable properties of `source` onto `target`, ignoring `__proto__`.
 *
 * 把 `source` 自有的可枚举属性复制到 `target`，并忽略 `__proto__`。
 *
 * @param target - The object to write to. 目标对象
 * @param source - The object to copy from. 源对象
 *
 * @internal
 */
export function copyOwnDataProperties(target: object, source: object): void {
  if (!Object.prototype.hasOwnProperty.call(source, PROTO_KEY)) {
    Object.assign(target, source)
    return
  }

  for (const key of Reflect.ownKeys(source)) {
    if (key !== PROTO_KEY && Object.prototype.propertyIsEnumerable.call(source, key)) {
      copyDataKey(target, key, (source as Record<PropertyKey, unknown>)[key])
    }
  }
}
