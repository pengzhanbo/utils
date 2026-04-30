/**
 * Promise, or maybe not
 *
 * Promise 类型或非 Promise 类型
 *
 * @category Types
 * @typeParam T - The type of the value / 值的类型
 */
export type Awaitable<T> = T | PromiseLike<T>

/**
 * Function
 *
 * 函数类型
 *
 * @category Types
 */
export type Fn<T = any> = (...args: any[]) => T

/**
 * Async Function
 *
 * 异步函数类型
 *
 * @category Types
 */
export type AsyncFn<T = void> = (...args: any[]) => Promise<T>

/**
 * The return type of an async function
 *
 * 异步函数的返回类型
 *
 * @category Types
 */
export type AsyncReturnType<T extends AsyncFn> = Awaited<ReturnType<T>>
