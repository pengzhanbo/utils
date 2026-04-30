/**
 * Create a function that can only be called once,
 * and repeated calls return the result of the first call
 *
 * 创建只能被调用一次的函数，重复调用返回第一次调用的结果
 *
 * @category Function
 *
 * @typeParam T - The type of the function / 函数的类型
 * @param func - The function to wrap. 要包装的函数
 * @returns A new function that can only be called once. 只能被调用一次的新函数
 *
 * @remarks
 * If the wrapped function throws an error on its first call, the `called` flag remains `false`, allowing the function to be retried on the next invocation. This implements a retry-on-exception behavior.
 *
 * 如果包装的函数在第一次调用时抛出异常，`called` 标志保持为 `false`，允许在下一次调用时重试。这实现了异常重试行为。
 *
 * @example
 * ```ts
 * const add = (a, b) => a + b
 * const onceAdd = once(add)
 * onceAdd(1, 2) // => 3
 * onceAdd(2, 3) // => 3
 * ```
 */
export function once<T extends (...args: any[]) => any>(func: T): T {
  let called = false
  let res: ReturnType<T>
  return function (this: any, ...args: Parameters<T>) {
    if (called) return res
    res = func.apply(this, args)
    called = true
    return res
  } as T
}
