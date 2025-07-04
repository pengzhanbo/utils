type GenNode<
  K extends string | number,
  IsRoot extends boolean,
> = IsRoot extends true
  ? `${K}`
  : `.${K}` | (K extends number ? `[${K}]` | `.[${K}]` : never)

/**
 * Object key paths
 * @category Types
 */
export type ObjectKeyPaths<
  T extends object,
  IsRoot extends boolean = true,
  K extends keyof T = keyof T,
> = K extends string | number
  ? | GenNode<K, IsRoot>
  | (T[K] extends object
    ? `${GenNode<K, IsRoot>}${ObjectKeyPaths<T[K], false>}`
    : never)
  : never

type KeysPaths<
  T extends string,
  O extends string = '',
> = T extends `${infer R}['${infer K}']${infer Rest}`
  ? KeysPaths<Rest, `${O extends '' ? O : `${O}.`}${R}.${K}`>
  : T extends `${infer R}["${infer K}"]${infer Rest}`
    ? KeysPaths<Rest, `${O extends '' ? O : `${O}.`}${R}.${K}`>
    : T extends `${infer R}[${infer K}]${infer Rest}`
      ? KeysPaths<Rest, `${O extends '' ? O : `${O}.`}${R}.${K}`>
      : T extends ''
        ? O
        : `${O extends '' ? O : `${O}.`}${T}`

/**
 * Get a value from an object
 * @category Types
 */
export type ObjectGet<
  T extends Record<PropertyKey, any>,
  P extends string,
> = KeysPaths<P> extends `${infer R}.${infer Rest}`
  ? ObjectGet<T[R], Rest>
  : T[P]

type MergeInsertions<T> = T extends object
  ? { [K in keyof T]: MergeInsertions<T[K]> }
  : T

/**
 * Deep merge
 * @category Types
 */
export type DeepMerge<F, S> = MergeInsertions<{
  [K in keyof F | keyof S]: K extends keyof S & keyof F
    ? DeepMerge<F[K], S[K]>
    : K extends keyof S
      ? S[K]
      : K extends keyof F
        ? F[K]
        : never
}>
