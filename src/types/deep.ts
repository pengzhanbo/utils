/**
 * Makes all nested properties optional recursively
 *
 * 递归地将所有嵌套属性设为可选
 *
 * @category Types
 *
 * @example
 * ```ts
 * interface Person {
 *   name: string
 *   address: { city: string; zip: string }
 * }
 * type PartialPerson = DeepPartial<Person>
 * // { name: string; address?: { city?: string; zip?: string } | undefined }
 * ```
 * @typeParam T - The type of elements in the array / 数组元素的类型
 */
export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

/**
 * Makes all nested properties required recursively
 *
 * 递归地将所有嵌套属性设为必需
 *
 * @category Types
 *
 * @example
 * ```ts
 * interface Person {
 *   name?: string
 *   address?: { city?: string; zip?: string }
 * }
 * type RequiredPerson = DeepRequired<Person>
 * // { name: string; address: { city: string; zip: string } }
 * ```
 */
export type DeepRequired<T> = T extends (infer U)[]
  ? DeepRequired<U>[]
  : T extends object
    ? { [K in keyof T]-?: DeepRequired<T[K]> }
    : T

/**
 * Makes all nested properties readonly recursively
 *
 * 递归地将所有嵌套属性设为只读
 *
 * @category Types
 *
 * @example
 * ```ts
 * interface Person {
 *   name: string
 *   address: { city: string }
 * }
 * type ReadonlyPerson = DeepReadonly<Person>
 * // { readonly name: string; readonly address: { readonly city: string } }
 * ```
 */
export type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T

/**
 * Extracts the keys of T that are required (non-optional)
 *
 * 提取 T 中必填的键（非可选）
 *
 * @category Types
 *
 * @example
 * ```ts
 * interface Person {
 *   name: string
 *   age?: number
 *   address: string
 * }
 * type Keys = RequiredKeys<Person>
 * // 'name' | 'address'
 * ```
 */
export type RequiredKeys<T extends object> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T]

/**
 * Extracts the keys of T that are optional
 *
 * 提取 T 中可选的键
 *
 * @category Types
 *
 * @example
 * ```ts
 * interface Person {
 *   name: string
 *   age?: number
 *   address: string
 * }
 * type Keys = OptionalKeys<Person>
 * // 'age'
 * ```
 */
export type OptionalKeys<T extends object> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never
}[keyof T]
