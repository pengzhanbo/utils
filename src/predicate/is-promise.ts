import { T_FUNCTION, T_OBJECT } from '../_internal/tags'
import { isFunction } from './is-function'

/**
 * Checks if the input is a Promise.
 *
 * 检查输入是否为 Promise。
 *
 * @category Predicate
 *
 * @typeParam T - The type of the Promise resolution value / Promise 解析值的类型
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is a Promise, false otherwise. 如果值为 Promise 则返回 true，否则返回 false
 *
 * @remarks
 * This function relies on `instanceof` operator, which fails for promises originating from different realms
 * (e.g., iframes or separate VM contexts). It does **not** detect "thenable" objects (objects with a `then` method
 * that behave like promises).
 *
 * 该函数依赖于 `instanceof` 运算符，对于来自不同环境（例如 iframe 或独立 VM 上下文）的 Promise 无法检测。
 * 它**不**检测 "thenable" 对象（具有 `then` 方法并像 Promise 一样行为的对象）。
 *
 * @example
 * ```ts
 * isPromise(Promise.resolve()) // => true
 * isPromise({}) // => false
 * ```
 */
export function isPromise<T = unknown>(v: unknown): v is Promise<T> {
  return v instanceof Promise
}

/**
 * Checks if the input is a Promise-like object.
 *
 * 检查输入是否为 Promise 类似对象。
 *
 * @category Predicate
 *
 * @typeParam T - The type of the Promise resolution value / Promise 解析值的类型
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is a Promise-like object, false otherwise. 如果值为 Promise 类似对象则返回 true，否则返回 false
 *
 * @remarks
 * This function checks if the value has a `then` method that is a function.
 *
 * 该函数检查值是否有 `then` 方法且该方法是一个函数。
 *
 * @example
 * ```ts
 * isPromiseLike(Promise.resolve()) // => true
 * isPromiseLike({}) // => false
 * ```
 */
export function isPromiseLike<T = unknown>(v: unknown): v is PromiseLike<T> {
  if (isPromise(v)) return true

  if (v == null) return false

  const type = typeof v
  if (type !== T_OBJECT && type !== T_FUNCTION) return false

  return isFunction((v as PromiseLike<T>).then)
}
