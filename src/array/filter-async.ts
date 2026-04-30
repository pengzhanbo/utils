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
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param array - The array to filter. 要过滤的数组
 * @param predicate - An async predicate function to test each element. 用于测试每个元素的异步谓词函数
 * @param concurrency - The maximum number of concurrent operations. 最大并发操作数
 * @returns A promise that resolves to the filtered array. 解析为过滤后数组的Promise
 *
 * @remarks
 * Predicates are executed concurrently via `promiseParallel` under the hood.
 * The results maintain the original array order regardless of the order in which predicates resolve.
 * The `concurrency` parameter controls the maximum number of simultaneously pending operations.
 *
 * 谓词函数通过底层的`promiseParallel`并发执行。
 * 无论谓词函数解析的顺序如何，结果都保持原始数组的顺序。
 * `concurrency`参数控制同时进行中的最大操作数。
 *
 * @see {@link mapAsync} — for async transformation / 异步转换
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
  const result: boolean[] = await promiseParallel(
    array.map(
      (...args) =>
        () =>
          predicate(...args),
    ),
    concurrency,
  )

  return array.filter((_, index) => result[index])
}
