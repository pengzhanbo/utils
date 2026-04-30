import { promiseParallel } from '../promise'

/**
 * Transforms each element in an array using an async callback function and returns
 * a promise that resolves to an array of transformed values.
 *
 * 使用异步回调函数转换数组中的每个元素，并返回一个解析为转换后值数组的 promise。
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @typeParam R - The type of the transformed result / 转换结果的类型
 * @param array - The array to transform / 要转换的数组
 * @param transform - The async callback function to apply to each element / 对每个元素应用的异步回调函数
 * @param concurrency - The maximum number of concurrent operations to allow / 允许的最大并发操作数
 * @returns A promise that resolves to an array of transformed values / 解析为转换后值数组的 promise
 *
 * @remarks
 * Transform functions are executed concurrently via {@link promiseParallel} under the hood.
 * The results maintain the original array order regardless of the order in which transforms resolve.
 * The `concurrency` parameter controls the maximum number of simultaneously pending operations.
 *
 * 转换函数通过底层的 {@link promiseParallel}并发执行。
 * 无论转换函数的解析顺序如何，结果都保持原始数组的顺序。
 * `concurrency`参数控制同时进行中的最大操作数。
 *
 * @see {@link filterAsync} — for async filtering / 异步过滤
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
export async function mapAsync<T, R = T>(
  array: readonly T[],
  transform: (item: T, index: number, array: readonly T[]) => Promise<R>,
  concurrency?: number,
): Promise<R[]> {
  const result: R[] = await promiseParallel(
    array.map(
      (...args) =>
        () =>
          transform(...args),
    ),
    concurrency,
  )
  return result
}
