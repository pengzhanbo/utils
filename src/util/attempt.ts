import { isError } from '../predicate'

/**
 * Attempt to execute a function and return the result or error.
 * Returns a tuple where:
 * - On success: [null, Result] - First element is null, second is the result
 * - On error: [Error, null] - First element is the caught error, second is null
 *
 * **Only applicable to synchronous execution functions**
 *
 * 尝试执行函数并返回结果或错误。返回一个元组，其中：
 * - 成功时：[null, Result] - 第一个元素为 null，第二个为结果
 * - 错误时：[Error, null] - 第一个元素为捕获的错误，第二个为 null
 *
 * **仅适用于同步执行函数**
 *
 * @category Util
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 *
 * @param func - The function to execute. 要执行的函数
 * @param args - The arguments to pass to the function. 要传递给函数的参数
 *
 * @example
 * ```ts
 * const [error, result] = attempt(() => 12) // [null, 12]
 * const [error, result] = attempt(() => { throw new Error('error') }) // [Error, null]
 * ```
 *
 * @example
 * ```ts
 * const add = (a, b) => a + b
 * const [error, result] = attempt(add, 1, 2) // [null, 3]
 * // or
 * const [error, result] = attempt(() => add(1, 2)) // [null, 3]
 * ```
 */
export function attempt<T extends (...args: any[]) => any, E = Error>(
  func: T,
  ...args: Parameters<T>
): [null, ReturnType<T>] | [E, null] {
  try {
    return [null, func(...args)]
  } catch (error) {
    return [(isError(error) ? error : new Error(String(error))) as E, null]
  }
}
