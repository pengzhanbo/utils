/**
 * Checks if the input is a Promise
 *
 * 检查输入是否为 Promise
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a Promise, false otherwise. 如果值为 Promise 则返回 true，否则返回 false
 */
export function isPromise<T = unknown>(v: unknown): v is Promise<T> {
  return v instanceof Promise
}
