import { T_OBJECT } from '../_internal/tags'
import { isArray, isNull, isPlainObject } from '../predicate'

/**
 * Deeply freeze an object recursively — the object and all its nested objects become immutable.
 * Supports arrays, plain objects, Symbol keys, and non-enumerable properties.
 *
 * 递归深度冻结一个对象 —— 对象及其所有嵌套对象变得不可变。
 * 支持数组、普通对象、Symbol 键和不可枚举属性。
 *
 * @category Object
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param obj - The object to deeply freeze. 要深度冻结的对象。
 * @returns The same object, now deeply frozen. 同一对象，现已深度冻结。
 *
 * @remarks
 * **Mutation**: This function mutates the original object in place via `Object.freeze()`.
 * It does NOT create a copy. If you need a frozen copy, call {@link deepClone} first.
 *
 * **Circular references**: Handled safely via an internal `Set` that tracks visited objects,
 * preventing infinite recursion.
 *
 * **Supported types**: Only arrays and plain objects (including their Symbol-keyed and
 * non-enumerable properties) are recursively frozen. Other object types (Date, Map, Set, etc.)
 * are left untouched.
 *
 * **变更**：此函数通过 `Object.freeze()` 原地修改原始对象，不会创建副本。
 * 如需冻结副本，请先调用 {@link deepClone}。
 *
 * **循环引用**：通过内部 `Set` 跟踪已访问对象来安全处理，防止无限递归。
 *
 * **支持的类型**：仅递归冻结数组和普通对象（包括其 Symbol 键和不可枚举属性）。
 * 其他对象类型（Date、Map、Set 等）不受影响。
 *
 * @example
 * ```ts
 * const obj = deepFreeze({ a: { b: 1 }, c: [1, 2, 3] })
 * // All nested objects are now immutable
 * // obj.a.b = 2 // TypeError in strict mode
 * ```
 *
 * @example
 * Circular reference safety:
 * ```ts
 * const obj: any = { a: 1 }
 * obj.self = obj
 * deepFreeze(obj) // Does not cause stack overflow
 * ```
 */
export function deepFreeze<T>(obj: T): T {
  freezeImpl(obj, new Set<unknown>())
  return obj
}

function freezeImpl(value: unknown, visited: Set<unknown>): void {
  // oxlint-disable-next-line valid-typeof
  if (isNull(value) || typeof value !== T_OBJECT) return
  if (visited.has(value)) return
  visited.add(value)
  const freeze = Object.freeze

  if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      freezeImpl(value[i], visited)
    }
    freeze(value)
  } else if (isPlainObject(value)) {
    const allKeys = [...Object.getOwnPropertyNames(value), ...Object.getOwnPropertySymbols(value)]

    for (let i = 0; i < allKeys.length; i++) {
      freezeImpl(value[allKeys[i]!], visited)
    }
    freeze(value)
  }
}
