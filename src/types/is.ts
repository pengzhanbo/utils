import type { Not, Primitive } from './basic'
import type { NegativeInfinity, PositiveInfinity } from './numeric'

/**
 * If the type T accepts type `Primitive`, output type true, otherwise output type false.
 *
 * `type Primitive = string | number | boolean | bigint | symbol | null | undefined`
 *
 * 如果类型 T 接受类型 `Primitive`，则输出 true，否则输出 false。
 *
 * @category Types
 */
export type IsPrimitive<T> = [T] extends [Primitive] ? true : false

/**
 * If the type T accepts type "any", output type true, otherwise output type false.
 *
 * 如果类型T接受类型"any"，则输出类型true，否则输出类型false。
 *
 * @see https://stackoverflow.com/a/49928360/1490091
 *
 * @category Types
 */
export type IsAny<T> = 0 extends 1 & NoInfer<T> ? true : false

/**
 * If the type T accepts type `never`, output type true, otherwise output type false.
 *
 * 如果类型 T 接受类型 `never`，则输出 true，否则输出 false。
 *
 * @see https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919
 * @see https://stackoverflow.com/a/53984913/10292952
 *
 * @category Types
 */
export type IsNever<T> = [T] extends [never] ? true : false

/**
 * If the type T accepts type `null`, output type true, otherwise output type false.
 *
 * 如果类型 T 接受类型 `null`，则输出 true，否则输出 false。
 *
 * @category Types
 */
export type IsNull<T> = [T] extends [null] ? true : false

/**
 * If the type T accepts type `null`, output type true, otherwise output type false.
 *
 * 如果类型 T 包含类型 `null`，则输出 true，否则输出 false。
 *
 * @example
 * ```ts
 * type A = IsNullable<string>;
 * //=> false
 *
 * type B = IsNullable<string | null>;
 * //=> true
 * ```
 *
 * @category Types
 */
export type IsNullable<T> =
  IsAny<T> extends true ? true : Extract<T, null> extends never ? false : true

/**
 * If the type T accepts type `undefined`, output type true, otherwise output type false.
 *
 * 如果类型 T 接受类型 `undefined`，则输出 true，否则输出 false。
 *
 * @category Types
 */
export type IsUndefined<T> = [T] extends [undefined] ? true : false

/**
 * If the type T accepts type `unknown`, output type true, otherwise output type false.
 *
 * 如果类型 T 接受类型 `unknown`，则输出 true，否则输出 false。
 *
 * @category Types
 */
export type IsUnknown<T> = unknown extends T // `T` can be `unknown` or `any`
  ? IsNull<T> extends false // `any` can be `null`, but `unknown` can't be
    ? true
    : false
  : false

/**
 * If the type T is a union type, output type true, otherwise output type false.
 *
 * 如果类型 T 是联合类型，则输出 true，否则输出 false。
 *
 * @category Types
 */
export type IsUnion<T> = InternalIsUnion<T>

/**
 * The actual implementation of `IsUnion`.
 *
 * `IsUnion` 的实际实现。
 */
type InternalIsUnion<T, U = T> = (
  IsNever<T> extends true ? false : T extends any ? ([U] extends [T] ? false : true) : never
) extends infer Result
  ? // In some cases `Result` will return `false | true` which is `boolean`,
    // that means `T` has at least two types and it's a union type,
    // so we will return `true` instead of `boolean`.
    // 在某些情况下，`Result` 会返回 `false | true`，即 `boolean`，
    // 这意味着 `T` 至少有两种类型，并且它是一个联合类型，
    // 因此我们将返回 `true` 而不是 `boolean`。
    boolean extends Result
    ? true
    : Result
  : never // Should never happen

/**
 * If the type X is equal to the type Y, output type true, otherwise output type false.
 *
 * 如果类型 X 等于类型 Y，则输出 true，否则输出 false。
 *
 * @category Types
 */
export type IsEqual<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

/**
 * Returns a boolean for whether the given `boolean` is not `false`.
 *
 * 返回一个布尔值，表示给定的`boolean`是否不为`false`。
 *
 * @category Types
 */
export type IsNotFalse<T extends boolean> = [T] extends [false] ? false : true

/**
 * Returns a boolean for whether the given type is `any` or `never`.
 *
 * This type can be better to use than {@link IfNotAnyOrNever `IfNotAnyOrNever`} in recursive types because it does not evaluate any branches.
 *
 * 返回一个布尔值，用于判断给定类型是否为 `any` 或 `never`。
 *
 * 在递归类型中使用此类型比使用 {@link IfNotAnyOrNever} 更优，因为它不会评估任何分支。
 *
 * @example
 * ```
 * // When `T` is a NOT `any` or `never` (like `string`) => Returns `false`
 * type A = IsAnyOrNever<string>;
 * //=> false
 *
 * // When `T` is `any` => Returns `true`
 * type B = IsAnyOrNever<any>;
 * //=> true
 *
 * // When `T` is `never` => Returns `true`
 * type C = IsAnyOrNever<never>;
 * //=> true
 * ```
 *
 * @category Types
 */
export type IsAnyOrNever<T> = IsNotFalse<IsAny<T> | IsNever<T>>

/**
 * Returns a boolean for whether the given number is a float, like `1.5` or `-1.5`.
 *
 * 返回一个布尔值，表示给定的数字是否为浮点数，例如 `1.5` 或 `-1.5`。
 *
 * @category Types
 */
export type IsFloat<T> = T extends number
  ? `${T}` extends `${number}e${infer E extends '-' | '+'}${number}`
    ? E extends '-'
      ? true
      : false
    : `${T}` extends `${number}.${number}`
      ? true
      : false
  : false

export type IsInteger<T> = T extends bigint
  ? true
  : T extends number
    ? number extends T
      ? false
      : T extends PositiveInfinity | NegativeInfinity
        ? false
        : Not<IsFloat<T>>
    : false
