/**
 * Deferred value type
 *
 * 延迟值类型
 */
export interface Deferred<T> {
  /**
   * The promise that will resolve or reject.
   *
   * 将会 resolve 或 reject 的 Promise。
   */
  promise: Promise<T>
  /**
   * Resolve the promise with a value.
   *
   * 使用一个值 resolve 该 Promise。
   */
  resolve: (value: T | PromiseLike<T>) => void
  /**
   * Reject the promise with a reason.
   *
   * 使用一个原因 reject 该 Promise。
   */
  reject: (reason?: unknown) => void
}

/**
 * Create a deferred promise, exposing `resolve` and `reject` functions.
 *
 * 创建一个延迟 Promise，暴露 `resolve` 和 `reject` 函数。
 *
 * @category Promise
 *
 * @typeParam T - The type of the resolved value / 解析值的类型
 *
 * @returns An object with `promise`, `resolve` and `reject` properties.
 *
 * @remarks
 * The returned `resolve` and `reject` functions can be called externally to
 * control the lifecycle of the promise. Only the first call takes effect;
 * subsequent calls are ignored by the underlying Promise.
 *
 * 返回的对象中的 `resolve` 和 `reject` 函数可以被外部调用，以控制 Promise 的生命周期。
 * 只有第一次调用生效，后续调用会被底层的 Promise 忽略。
 *
 * @example
 * ```ts
 * const { promise, resolve, reject } = deferred<string>()
 *
 * // Later, in any context:
 * resolve('done')
 * // or
 * reject(new Error('failed'))
 *
 * const result = await promise // => 'done'
 * ```
 */
export function deferred<T = unknown>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  return { promise, resolve, reject }
}
