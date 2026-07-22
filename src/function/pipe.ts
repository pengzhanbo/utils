import type { Fn } from '../types'

/**
 * Get the type of the first element in the array
 *
 * 获取数组的第一个元素类型
 * @typeParam Fn - The type of the function / 函数的类型
 * @typeParam T - The type of elements in the array / 数组元素的类型
 */
type FirstArray<T extends any[]> = T extends [infer U, ...any[]] ? U : Fn
/**
 * Get the type of the last element in the array
 *
 * 获取数组的最后一个元素类型
 */
type LastArray<T extends any[]> = T extends [...any[], infer U] ? U : Fn

/**
 * pipe multiple functions, left to right
 *
 * 组合多个函数，从左到右执行
 *
 * @category Function
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param fns - The functions to pipe. 要组合的函数
 * @returns A new function that is the pipeline of the input functions. 由输入函数组合而成的新函数
 *
 * @example
 * ```ts
 * const add = (a) => a + 1
 * const subtract = (a) => a - 2
 * const multiply = (a, b) => a * b
 * pipe(add, subtract, multiply)(1, 2) // => (1 * 2) + 1 - 2 = 1
 * ```
 */
export function pipe<T extends Fn[] = Fn[]>(
  ...fns: T
): (...args: Parameters<FirstArray<T>>) => ReturnType<LastArray<T>> {
  return function (this: unknown, ...args: Parameters<FirstArray<T>>) {
    const len = fns.length
    if (len === 0) return args[0] as ReturnType<LastArray<T>>
    if (len === 1) return fns[0]!.apply(this, args)

    let result = fns[0]!.apply(this, args)
    for (let i = 1; i < len; i++) {
      result = fns[i]!.call(this, result)
    }
    return result
  }
}
