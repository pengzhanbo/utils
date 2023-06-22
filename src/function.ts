import type { Fn, Nullable } from './types'

/**
 * noop function
 * @category Function
 */
export function noop() {}

/**
 * guard function that returns if val is truthy
 * @category Function
 * @example
 * ```ts
 * [1, 2, 3, '', false, undefined].filter(isTruthy) // => [1, 2, 3]
 * ```
 */
export function isTruthy(val: unknown) {
  return Boolean(val)
}

/**
 * @category Function
 * @example
 * ```ts
 * [1, '', false, undefined].filter(NotUndefined) // => [1, '', false]
 * ```
 */
export function NotUndefined(val: unknown) {
  return typeof val !== 'undefined'
}

/**
 * call the function or every functions in an array
 * @category Function
 */
export function invoke<T>(fn: Fn<T>): T
export function invoke(fns: Nullable<Fn>[]): void
export function invoke<T>(fns: Nullable<Fn>[] | Fn<T>) {
  if (Array.isArray(fns)) {
    fns.forEach((fn) => fn && fn())
  } else {
    return fns()
  }
}

type ComposeFn = (...args: any[]) => any
type LastArray<T extends any[]> = T extends [...any[], infer U] ? U : Fn
type FirstArray<T extends any[]> = T extends [infer U, ...any[]] ? U : Fn

/**
 * compose multiple functions
 * @category Function
 */
export function compose<T extends ComposeFn[] = ComposeFn[]>(
  ...fns: T
): (...args: Parameters<LastArray<T>>) => ReturnType<FirstArray<T>> {
  return function (...args: Parameters<LastArray<T>>) {
    const len = fns.length
    if (len === 0) return args
    if (len === 1) return fns[0](...args)
    return fns
      .slice(0, -1)
      .reduceRight((acc, fn) => fn(acc), fns[len - 1](...args))
  }
}
