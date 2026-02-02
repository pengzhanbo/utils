import type { AsyncReturnType } from '../types'

/**
 * Attempt to execute a function and return the result or error.
 * Returns a Promise that resolves to a tuple where:
 * - On success: [null, Result] - First element is null, second is the result
 * - On error: [Error, null] - First element is the caught error, second is null
 *
 * **Only applicable to asynchronous execution functions**
 *
 * 尝试执行函数并返回结果或错误。返回一个解析为元组的 Promise，其中：
 * - 成功时：[null, Result] - 第一个元素为null，第二个为结果
 * - 错误时：[Error, null] - 第一个元素为捕获的错误，第二个为null
 *
 * **仅适用于异步执行函数**
 *
 * @category Util
 *
 * @param func - The asynchronous function to execute - 要执行的异步函数
 * @param args - The arguments to pass to the function - 要传递给函数的参数
 *
 * @example
 * ```ts
 * const [error, result] = await attempt(() => Promise.resolve(12)) // [null, 12]
 * const [error, result] = await attempt(() => { Promise.reject(new Error('error')) }) // [Error, null]
 * ```
 *
 * @example
 * ```ts
 * const add = (a, b) => Promise.resolve(a + b)
 * const [error, result] = await attempt(add, 1, 2) // [null, 3]
 * // or
 * const [error, result] = await attempt(async() => await add(1, 2)) // [null, 3]
 * ```
 */
export async function attemptAsync<T extends (...args: any[]) => Promise<any>, E extends Error>(
  func: T,
  ...args: Parameters<T>
): Promise<[null, AsyncReturnType<T>] | [E, null]> {
  try {
    return [null, await func(...args)]
  } catch (error) {
    return [error as E, null]
  }
}
