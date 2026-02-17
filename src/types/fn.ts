/**
 * Promise, or maybe not
 *
 * Promise 类型或非 Promise 类型
 *
 * @category Types
 *
 * @template T - 原始类型
 */
export type Awaitable<T> = T | PromiseLike<T>

/**
 * Function
 *
 * 函数类型
 *
 * @category Types
 *
 * @template T - 函数返回值类型
 */
export type Fn<T = void> = (...args: any[]) => T

/**
 * Async Function
 *
 * 异步函数类型
 *
 * @category Types
 *
 * @template T - 异步函数返回值类型
 */
export type AsyncFn<T = void> = (...args: any[]) => Promise<T>

/**
 * The return type of an async function
 *
 * 异步函数的返回类型
 *
 * @category Types
 *
 * @template T - 异步函数类型
 */
export type AsyncReturnType<T extends AsyncFn> = Awaited<ReturnType<T>>
