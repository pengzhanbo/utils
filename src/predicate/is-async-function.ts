import { typeOf } from './type-of.js'

/**
 * Checks if the input is an async function.
 *
 * 检查输入是否为异步函数。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is an async function, false otherwise. 如果值为异步函数则返回 true，否则返回 false
 *
 * @remarks
 * This function uses `Object.prototype.toString` internally, so it is cross-realm safe (e.g. async functions created in an iframe or `node:vm` context are still detected). It does not match async generator functions.
 *
 * 此函数内部使用 `Object.prototype.toString`，因此跨上下文安全(例如在 iframe 或 `node:vm` 上下文中创建的异步函数也能被识别)。它不匹配异步生成器函数。
 *
 * @example
 * ```ts
 * isAsyncFunction(async () => {}) // => true
 * isAsyncFunction(() => {}) // => false
 * isAsyncFunction(Promise.resolve()) // => false
 * ```
 */
export function isAsyncFunction(v: unknown): v is (...args: any[]) => Promise<any> {
  return typeOf(v) === 'asyncfunction'
}
