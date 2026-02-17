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
 *
 * @param array - The array to filter. 要过滤的数组
 * @param predicate - An async predicate function to test each element. 用于测试每个元素的异步谓词函数
 * @param concurrency - The maximum number of concurrent operations. 最大并发操作数
 * @returns A promise that resolves to the filtered array. 解析为过滤后数组的Promise
 *
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
  const result = (await promiseParallel(
    array.map(
      (...args) =>
        () =>
          predicate(...args),
    ),
    concurrency,
  )) as boolean[]

  return array.filter((_, index) => result[index])
}
