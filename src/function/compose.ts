import type { Fn } from '../types'

type ComposeFn = (...args: any[]) => any
type LastArray<T extends any[]> = T extends [...any[], infer U] ? U : Fn
type FirstArray<T extends any[]> = T extends [infer U, ...any[]] ? U : Fn

/**
 * compose multiple functions, right to left
 *
 * 组合多个函数，从右到左执行
 *
 * @category Function
 *
 * @param fns - The functions to compose. 要组合的函数
 * @returns A new function that is the composition of the input functions. 由输入函数组合而成的新函数
 *
 * @example
 * ```ts
 * const add = (a) => a + 1
 * const subtract = (a) => a - 2
 * const multiply = (a, b) => a * b
 * compose(add, subtract, multiply)(1, 2) // => (1 * 2) - 2 + 1 = 1
 * ```
 */
export function compose<T extends ComposeFn[] = ComposeFn[]>(
  ...fns: T
): (...args: Parameters<LastArray<T>>) => ReturnType<FirstArray<T>> {
  return function (...args: Parameters<LastArray<T>>) {
    const len = fns.length
    if (len === 0) return args
    if (len === 1) return fns[0]!(...args)
    return fns.slice(0, -1).reduceRight((acc, fn) => fn(acc), fns[len - 1]!(...args))
  }
}
