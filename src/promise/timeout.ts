import { TimeoutError } from '../error/TimeoutError'
import { sleep } from './sleep'

/**
 * Returns a promise that rejects with a `TimeoutError` after a specified delay.
 *
 * 返回一个 promise，该 promise 在指定的延迟时间后拒绝，抛出一个 `TimeoutError`。
 *
 * @category Promise
 * @param ms - the number of milliseconds to wait before rejecting the promise. 超时的毫秒数
 * @throws Throws a `TimeoutError` after the specified delay.
 * @example
 * ```ts
 * @example
 * ```
 * try {
 *   await timeout(1000); // Timeout exception after 1 second
 * } catch (error) {
 *   console.error(error); // Will log 'The operation was timed out'
 * }
 * ```
 */
export async function timeout(ms: number): Promise<never> {
  await sleep(ms)
  throw new TimeoutError()
}

/**
 * Executes an async function and enforces a timeout.
 *
 * 执行异步函数, 超时则强制拒绝
 *
 * @category Promise
 *
 * @param run - the async function to execute.
 * @param ms - the number of milliseconds to wait before rejecting the promise.
 * @returns A promise that resolves with the result of the async function, or rejects with a `TimeoutError` if the function does not resolve within the specified timeout. 一个 promise，它将解析为异步函数的结果，或者如果在指定超时内函数未解析，则拒绝并抛出`TimeoutError`。
 * @example
 * ```ts
 * async function fetchData() {
 *   const response = await fetch('https://example.com/data');
 *   return response.json();
 * }
 *
 * try {
 *   const data = await withTimeout(fetchData, 1000);
 *   console.log(data); // Logs the fetched data if `fetchData` is resolved within 1 second.
 * } catch (error) {
 *   console.error(error); // Will log 'TimeoutError' if `fetchData` is not resolved within 1 second.
 * }
 * ```
 */
export async function withTimeout<T>(run: () => Promise<T>, ms: number): Promise<T> {
  return Promise.race([run(), timeout(ms)])
}
