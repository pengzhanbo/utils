import type { IsAny, IsNever, IsNull, IsUndefined, IsUnknown } from './is'

/**
 * An if-else-like type that resolves depending on whether the given `boolean` type is `true` or `false`.
 *
 * Use-cases:
 * - You can use this in combination with `Is*` types to create an if-else-like experience. For example, `If<IsAny<any>, 'is any', 'not any'>`.
 *
 * 一种类似if-else的类型，根据给定的`boolean`类型是`true`还是`false`来解析。
 *
 * 用例：
 * - 你可以将此与 `Is*` 类型结合使用，以创建类似 if-else 的能力。例如，`If<IsAny<any>, 'is any', 'not any'>`。
 *
 * @category Types
 */
export type If<T extends boolean, Y, N> = IsNever<T> extends true ? N : T extends true ? Y : N

/**
 * If the type T accepts type "any", output type Y, otherwise output type N.
 *
 * 如果类型 T 接受类型"any"，则输出类型 Y ，否则输出类型 N 。
 *
 * @see https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
 *
 * @category Types
 *
 */
export type IfAny<T, Y, N> = If<IsAny<T>, Y, N>

/**
 * If the type T accepts type `null`, output type Y, otherwise output type N.
 *
 * 如果类型 T 接受类型 `null`，则输出类型 Y，否则输出类型 N。
 *
 * @category Types
 */
export type IfNull<T, Y = true, N = false> = If<IsNull<T>, Y, N>

/**
 * If the type T accepts type `undefined`, output type Y, otherwise output type N.
 *
 * 如果类型 T 接受类型 `undefined`，则输出类型 Y，否则输出类型 N。
 *
 * @category Types
 */
export type IfUndefined<T, Y = true, N = false> = If<IsUndefined<T>, Y, N>

/**
 * If the type T accepts type `never`, output type Y, otherwise output type N.
 *
 * 如果类型 T 接受类型 `never`，则输出类型 Y，否则输出类型 N。
 *
 * @category Types
 */
export type IfNever<T, Y = true, N = false> = If<IsNever<T>, Y, N>

/**
 * If the type T accepts type `unknown`, output type Y, otherwise output type N.
 *
 * 如果类型 T 接受类型 `unknown`，则输出类型 Y，否则输出类型 N。
 *
 * @category Types
 */
export type IfUnknown<T, Y = true, N = false> = If<IsUnknown<T>, Y, N>

/**
 * An if-else-like type that resolves depending on whether the given type is `any` or `never`.
 *
 * 一种类似if-else的类型，根据给定类型是`any`还是`never`来解析。
 *
 * @example
 * ```ts
 * // When `T` is a NOT `any` or `never` (like `string`) => Returns `IfNotAnyOrNever` branch
 * type A = IfNotAnyOrNever<string, 'VALID', 'IS_ANY', 'IS_NEVER'>;
 * //=> 'VALID'
 *
 * // When `T` is `any` => Returns `IfAny` branch
 * type B = IfNotAnyOrNever<any, 'VALID', 'IS_ANY', 'IS_NEVER'>;
 * //=> 'IS_ANY'
 *
 * // When `T` is `never` => Returns `IfNever` branch
 * type C = IfNotAnyOrNever<never, 'VALID', 'IS_ANY', 'IS_NEVER'>;
 * //=> 'IS_NEVER'
 * ```
 */
export type IfNotAnyOrNever<T, IfNotAnyOrNever, IfAny = any, IfNever = never> = If<
  IsAny<T>,
  IfAny,
  If<IsNever<T>, IfNever, IfNotAnyOrNever>
>
