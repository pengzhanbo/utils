/**
 * Function Helpers
 *
 * @module Function
 */
import type { Fn, Nullable } from './types'

/**
 * noop function
 *
 * 空函数
 *
 * @category Function
 */
export function noop() {}

/**
 * Create a function that can only be called once,
 * and repeated calls return the result of the first call
 *
 * 创建只能被调用一次的函数，重复调用返回第一次调用的结果
 *
 * @category Function
 */
export function once<T extends (...args: any[]) => any>(func: T): T {
  let called = false
  let res: any
  return ((...args) => {
    if (!called) {
      called = true
      res = func(...args)
      return res
    }
    return res
  }) as T
}

/**
 * call the function
 *
 * 调用函数
 *
 * @category Function
 */
export function invoke<T>(fn: Fn<T>, ...args: any): T
/**
 * call every functions in an array, the remaining parameters are passed in turn
 *
 * 调用数组中的每个函数，剩余参数依次传入
 *
 * @category Function
 *
 * @param fns - an array of functions
 */
export function invoke(fns: Nullable<Fn>[], ...args: any[]): void
export function invoke<T>(fns: Nullable<Fn>[] | Fn<T>, ...args: any[]): T | void {
  if (Array.isArray(fns))
    fns.forEach(fn => fn && fn(...args))
  else
    return fns(...args)
}

type ComposeFn = (...args: any[]) => any
type LastArray<T extends any[]> = T extends [...any[], infer U] ? U : Fn
type FirstArray<T extends any[]> = T extends [infer U, ...any[]] ? U : Fn

/**
 * compose multiple functions, right to left
 *
 * 组合多个函数，从右到左执行
 *
 * @category Function
 * @example
 * ```ts
 * const add = (a) => a + 1
 * const subtract = (a) => a - 2
 * const multiply = (a, b) => a * b
 * compose(add, subtract, multiply)(1, 2) => (1 * 2) - 2 + 1 = 1
 * ```
 */
export function compose<T extends ComposeFn[] = ComposeFn[]>(
  ...fns: T
): (...args: Parameters<LastArray<T>>) => ReturnType<FirstArray<T>> {
  return function (...args: Parameters<LastArray<T>>) {
    const len = fns.length
    if (len === 0)
      return args
    if (len === 1)
      return fns[0]!(...args)
    return fns
      .slice(0, -1)
      .reduceRight((acc, fn) => fn(acc), fns[len - 1]!(...args))
  }
}
