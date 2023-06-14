/**
 * Promise, or maybe not
 */
export type Awaitable<T> = T | PromiseLike<T>

/**
 * Function
 */
export type Fn<T = void> = () => T

/**
 * null or whatever
 */
export type Nullable<T> = T | null | undefined

/**
 * array or not yet
 */
export type Arrayable<T> = T | T[]

/**
 * Constructor
 */
export type Constructor<T = void> = new (...arg: any[]) => T
