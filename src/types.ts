/**
 * Type Helpers
 *
 * @module Types
 */

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

/**
 * null or whatever
 * @category Types
 */
export type Nullable<T> = T | null | undefined

/**
 * array or not yet
 * @category Types
 */
export type Arrayable<T> = T | T[]

/**
 * Constructor
 * @category Types
 */
export type Constructor<T = void> = new (...arg: any[]) => T

/**
 * Infers the element type of an array
 * @category Types
 */
export type ElementOf<T> = T extends (infer E)[] ? E : never
