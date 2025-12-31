/**
 * Promise, or maybe not
 * @category Types
 */
export type Awaitable<T> = T | PromiseLike<T>

/**
 * Function
 * @category Types
 */
export type Fn<T = void> = (...args: any[]) => T

/**
 * Async Function
 * @category Types
 */
export type AsyncFn<T = void> = (...args: any[]) => Promise<T>

/**
 * The return type of an async function
 * @category Types
 */
export type AsyncReturnType<T extends AsyncFn> = Awaited<ReturnType<T>>
