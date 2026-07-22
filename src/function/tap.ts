/**
 * Tap into a value, execute a side-effect function, and return the original value.
 * Useful for debugging or side-effects in pipe/compose chains.
 *
 * 拦截一个值，执行副作用函数，然后返回原始值。
 * 适用于 pipe/compose 链中的调试或副作用场景。
 *
 * @category Function
 *
 * @typeParam T - The type of the value / 值的类型
 * @param value - The value to tap into / 要拦截的值
 * @param fn - The side-effect function / 副作用函数
 * @returns The original value, unchanged / 原始值，不变
 *
 * @remarks
 * The return value of `fn` is ignored; only the side-effect matters.
 * `fn`接收的返回值被忽略，只有副作用有意义。
 *
 * @example
 * ```ts
 * const result = tap('hello', console.log)
 * // logs: 'hello'
 * // result === 'hello'
 * ```
 */
export function tap<T>(value: T, fn: (value: T) => void): T
/**
 * Create a tap function that executes a side-effect and returns the value.
 * Useful for inline use in pipe/compose chains.
 *
 * 创建一个拦截函数，执行副作用后返回值。
 * 适用于 pipe/compose 链中的内联使用。
 *
 * @category Function
 *
 * @typeParam T - The type of the value / 值的类型
 * @param fn - The side-effect function / 副作用函数
 * @returns A function that taps into a value / 一个拦截函数
 *
 * @example
 * ```ts
 * const debug = tap(console.log)
 * pipe(parse, debug, validate)
 * ```
 */
export function tap<T>(fn: (value: T) => void): (value: T) => T
export function tap<T>(
  ...args: [T, (value: T) => void] | [(value: T) => void]
): T | ((value: T) => T) {
  if (args.length === 1) {
    const [fn] = args
    return (value: T) => {
      fn(value)
      return value
    }
  }

  const [value, fn] = args
  fn(value)
  return value
}
