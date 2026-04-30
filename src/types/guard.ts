/**
 * null or whatever
 *
 * 可以是 null 或 undefined 的类型
 *
 * @category Types
 * @typeParam T - The type of elements in the array / 数组元素的类型
 */
export type Nullable<T> = T | null | undefined

/**
 * array or not yet
 *
 * 可以是单个值或数组的类型
 *
 * @category Types
 */
export type Arrayable<T> = T | T[]
