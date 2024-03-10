import type { Fn, Nullable } from './types'

/**
 * noop function
 * @category Function
 */
export function noop() {}

/**
 * Create a function that can only be called once,
 * and repeated calls return the result of the first call
 * @category Function
 */
export function once(func: Fn): Fn {
  let called = false
  let res: any
  return (...args) => {
    if (!called) {
      called = true
      res = func(...args)
      return res
    }
    return res
  }
}

/**
 * guard function that returns if val is truthy
 * @category Function
 * @example
 * ```ts
 * [1, 2, 3, '', false, undefined].filter(isTruthy) // => [1, 2, 3]
 * ```
 */
export function isTruthy(val: unknown): boolean {
  return Boolean(val)
}

/**
 * @category Function
 * @example
 * ```ts
 * [1, '', false, undefined].filter(NotUndefined) // => [1, '', false]
 * ```
 */
export function NotUndefined(val: unknown): boolean {
  return typeof val !== 'undefined'
}

/**
 * call the function or every functions in an array
 * @category Function
 */
export function invoke<T>(fn: Fn<T>): T
export function invoke(fns: Nullable<Fn>[]): void
export function invoke<T>(fns: Nullable<Fn>[] | Fn<T>): T | void {
  if (Array.isArray(fns))
    fns.forEach(fn => fn && fn())
  else
    return fns()
}

type ComposeFn = (...args: any[]) => any
type LastArray<T extends any[]> = T extends [...any[], infer U] ? U : Fn
type FirstArray<T extends any[]> = T extends [infer U, ...any[]] ? U : Fn

/**
 * compose multiple functions, right to left
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
      return fns[0](...args)
    return fns
      .slice(0, -1)
      .reduceRight((acc, fn) => fn(acc), fns[len - 1](...args))
  }
}
