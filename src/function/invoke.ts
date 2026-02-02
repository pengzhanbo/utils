import type { Fn, Nullable } from '../types'

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
  if (Array.isArray(fns)) fns.forEach((fn) => fn && fn(...args))
  else return fns(...args)
}
