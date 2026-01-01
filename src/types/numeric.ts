import type { IsFloat, IsInteger } from './is'

export type _Numeric = number | bigint

type Zero = 0 | 0n

/**
 * Matches the hidden `Infinity` type.
 *
 * 匹配隐藏的 `Infinity` 类型。
 *
 * @see https://github.com/microsoft/TypeScript/issues/31752
 *
 * @category Types
 */
// eslint-disable-next-line no-loss-of-precision
export type PositiveInfinity = 1e999

/**
 * Matches the hidden `-Infinity` type.
 *
 * 匹配隐藏的 `-Infinity` 类型。
 *
 * @see https://github.com/microsoft/TypeScript/issues/31752
 *
 * @category Types
 */
// eslint-disable-next-line no-loss-of-precision
export type NegativeInfinity = -1e999

/**
 * A finite `number`.
 *
 * You can't pass a `bigint` as they are already guaranteed to be finite.
 *
 * Use-case: Validating and documenting parameters.
 *
 * 一个有限的`数字`。
 *
 * 你不能传递`bigint`，因为它们已经被保证是有限的。
 *
 * 使用场景：验证和记录参数。
 *
 * @category Types
 *
 * @example
 * ```ts
 * declare function setScore<T extends number>(length: Finite<T>): void;
 * ```
 */
export type Finite<T extends number> = T extends PositiveInfinity | NegativeInfinity ? never : T

/**
 * A negative `number`/`bigint` (`-∞ < x < 0`)
 *
 * 负数 `number`/`bigint`（`-∞ < x < 0`）
 *
 * @category Types
 */
export type Negative<T extends _Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never

/**
 * A `number` that is an integer.
 *
 * 一个整数类型的`number`。
 *
 * @category Types
 */
export type Integer<T> = T extends unknown // To distributive type
  ? IsInteger<T> extends true ? T : never
  : never // Never happens

/**
 * A negative (`-∞ < x < 0`) `number` that is an integer.
 * Equivalent to `Negative<Integer<T>>`.
 *
 * 一个负数（`-∞ < x < 0`），且是整数的`number`。
 * 等同于`Negative<Integer<T>>`。
 */
export type NegativeInteger<T extends number> = Negative<Integer<T>>
/**
 * A `number` that is a float.
 *
 * 一个浮点数类型的`number`。
 *
 * @category Types
 */
export type Float<T> = T extends unknown // To distributive type
  ? IsFloat<T> extends true ? T : never
  : never // Never happens

/**
 * A negative (`-∞ < x < 0`) `number` that is not an integer.
 * Equivalent to `Negative<Float<T>>`.
 *
 * 一个非整数的负数（`-∞ < x < 0`）`number`。
 * 等同于 `Negative<Float<T>>`。
 */
export type NegativeFloat<T extends number> = Negative<Float<T>>
