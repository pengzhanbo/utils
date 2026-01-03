import { promiseParallel } from '../promise'

/**
 * Filters an array asynchronously using an async predicate function.
 *
 * Returns a promise that resolves to a new array containing only the elements
 * for which the predicate function returns a truthy value.
 *
 * 使用异步谓词函数对数组进行异步过滤。
 *
 * 返回一个Promise，该Promise解析为一个新数组，仅包含谓词函数返回真值的元素。
 *
 * @category Array
 * @example
 * ```ts
 * const users = [{ id: 1, active: true }, { id: 2, active: false }, { id: 3, active: true }];
 * const activeUsers = await filterAsync(users, async (user) => {
 *   return await checkUserStatus(user.id);
 * });
 * // Returns: [{ id: 1, active: true }, { id: 3, active: true }]
 * ```
 */
export async function filterAsync<T>(
  array: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => Promise<boolean>,
  concurrency?: number,
): Promise<T[]> {
  const result = await promiseParallel(
    array.map((...args) => () => predicate(...args)),
    concurrency,
  ) as boolean[]

  return array.filter((_, index) => result[index])
}
