/**
 * Return a Promise with `resolve` and `reject` methods
 *
 * 返回一个 Promise，带有 `resolve` 和 `reject` 方法
 *
 * @category Promise
 *
 * @typeParam T - The type of the resolved value / 解析值的类型
 * @returns A controlled promise. / 受控Promise
 *
 * @example
 * ```ts
 * const promise = createControlledPromise()
 *
 * await promise
 *
 * // in another context:
 * promise.resolve(data)
 * ```
 */
export function createControlledPromise<T>(): ControlledPromise<T> {
  let resolve!: (value: T | PromiseLike<T>) => void, reject!: (reason?: any) => void
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  }) as ControlledPromise<T>
  promise.resolve = resolve
  promise.reject = reject
  return promise
}

/**
 * Promise with `resolve` and `reject` methods of itself
 *
 * 带有自身`resolve`和`reject`方法的Promise
 */
export interface ControlledPromise<T = void> extends Promise<T> {
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}
