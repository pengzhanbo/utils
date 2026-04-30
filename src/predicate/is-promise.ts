import { T_PROMISE } from '../_internal/tags'
import { isTypeof } from './is-typeof'

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
 * This function relies on `instanceof Promise`, which fails for promises originating from different realms
 * (e.g., iframes or separate VM contexts). It does **not** detect "thenable" objects (objects with a `then` method
 * that behave like promises).
 *
 * 该函数依赖于 `instanceof Promise`，对于来自不同环境（例如 iframe 或独立 VM 上下文）的 Promise 无法检测。
 * 它**不**检测 "thenable" 对象（具有 `then` 方法并像 Promise 一样行为的对象）。
 *
 * @example
 * ```ts
 * isPromise(Promise.resolve()) // => true
 * isPromise({}) // => false
 * ```
 */
export function isPromise<T = unknown>(v: unknown): v is Promise<T> {
  return isTypeof(v, T_PROMISE)
}
