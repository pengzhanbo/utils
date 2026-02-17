import type { Fn, Nullable } from '../types'

/**
 * call the function
 *
 * 调用函数
 *
 * @category Function
 *
 * @param fn - The function to call. 要调用的函数
 * @param args - The arguments to pass to the function. 要传递给函数的参数
 * @returns The result of the function call. 函数调用的结果
 */
export function invoke<T>(fn: Fn<T>, ...args: any): T
/**
 * call every functions in an array, the remaining parameters are passed in turn
 *
 * 调用数组中的每个函数，剩余参数依次传入
 *
 * @category Function
 *
 * @param fns - An array of functions. 函数数组
 * @param args - The arguments to pass to each function. 要传递给每个函数的参数
 */
export function invoke(fns: Nullable<Fn>[], ...args: any[]): void
export function invoke<T>(fns: Nullable<Fn>[] | Fn<T>, ...args: any[]): T | void {
  if (Array.isArray(fns)) fns.forEach((fn) => fn && fn(...args))
  else return fns(...args)
}
