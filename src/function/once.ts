/**
 * Create a function that can only be called once,
 * and repeated calls return the result of the first call
 *
 * 创建只能被调用一次的函数，重复调用返回第一次调用的结果
 *
 * @category Function
 *
 * @param func - The function to wrap. 要包装的函数
 * @returns A new function that can only be called once. 只能被调用一次的新函数
 */
export function once<T extends (...args: any[]) => any>(func: T): T {
  let called = false
  let res: ReturnType<T>
  return ((...args: Parameters<T>) => {
    if (!called) {
      called = true
      res = func(...args)
      return res
    }
    return res
  }) as T
}
