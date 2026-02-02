import { promiseParallel } from '../promise'

/**
 * Transforms each element in an array using an async callback function and returns
 * a promise that resolves to an array of transformed values.
 *
 * 使用异步回调函数转换数组中的每个元素，并返回一个解析为转换后值数组的 promise。
 *
 * @example
 * ```ts
 * const users = [{ id: 1 }, { id: 2 }, { id: 3 }];
 * const userDetails = await mapAsync(users, async (user) => {
 *   return await fetchUserDetails(user.id);
 * });
 * // Returns: [{ id: 1, name: '...' }, { id: 2, name: '...' }, { id: 3, name: '...' }]
 * ```
 *
 * @example
 * ```ts
 * // With concurrency limit
 * const numbers = [1, 2, 3, 4, 5];
 * const results = await mapAsync(
 *   numbers,
 *   async (n) => await slowOperation(n),
 *   2
 * );
 * // Processes at most 2 operations concurrently
 * ```
 */
export async function mapAsync<T>(
  array: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => Promise<T>,
  concurrency?: number,
): Promise<T[]> {
  return (await promiseParallel(
    array.map(
      (...args) =>
        () =>
          predicate(...args),
    ),
    concurrency,
  )) as T[]
}
