/**
 * Retrieve a value from an object using dot path
 *
 * 使用 dot path 从一个对象中获取一个值
 *
 * @category Object
 * @example
 * ```ts
 * objectGet({ a: 1 }, 'a') // => 1
 * objectGet({ a: { b: 2 } }, 'a.b') // => 2
 * objectGet({ a: [{ b: 2 }] }, 'a[0].b') // => 2
 * ```
 */
export function objectGet<T extends Record<PropertyKey, any>, P extends ObjectKeyPaths<T>>(
  source: T,
  path: P,
): ObjectGet<T, P> {
  const keys = path.replace(/\[['"]?(.+?)['"]?\]/g, '.$1').split('.')
  let res: any = source
  for (const k of keys) res = res?.[k]

  return res
}

type GenNode<K extends string | number, IsRoot extends boolean> = IsRoot extends true
  ? `${K}`
  : `.${K}` | (K extends number ? `[${K}]` | `.[${K}]` : never)

/**
 * Object key paths
 * @category Types
 */
type ObjectKeyPaths<
  T extends object,
  IsRoot extends boolean = true,
  K extends keyof T = keyof T,
> = K extends string | number
  ?
      | GenNode<K, IsRoot>
      | (T[K] extends object ? `${GenNode<K, IsRoot>}${ObjectKeyPaths<T[K], false>}` : never)
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
type ObjectGet<T extends Record<PropertyKey, any>, P extends string> =
  KeysPaths<P> extends `${infer R}.${infer Rest}` ? ObjectGet<T[R], Rest> : T[P]
