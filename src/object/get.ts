/**
 * Retrieve a value from an object using dot path
 *
 * 使用 dot path 从一个对象中获取一个值
 *
 * @category Object
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param source - The source object. 源对象
 * @param path - The dot path to retrieve. 要获取的路径
 * @returns The value at the specified path. 指定路径处的值
 *
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
  const keys = parseObjectPath(path)
  let res: any = source
  for (const k of keys) res = res?.[k]

  return res
}

function parseObjectPath(path: string): string[] {
  const keys: string[] = []
  let i = 0
  while (i < path.length) {
    if (path[i] === '.') {
      i++
      continue
    }
    if (path[i] === '[') {
      const end = path.indexOf(']', i)
      if (end === -1) break
      const content = path.slice(i + 1, end)
      if (content === '') {
        i = end + 1
        continue
      }
      const first = content[0]
      const last = content[content.length - 1]
      if ((first === "'" && last === "'") || (first === '"' && last === '"')) {
        keys.push(content.slice(1, -1))
      } else {
        keys.push(content)
      }
      i = end + 1
    } else {
      let end = i
      while (end < path.length && path[end] !== '.' && path[end] !== '[') end++
      keys.push(path.slice(i, end))
      i = end
    }
  }
  return keys
}

type GenNode<K extends string | number, IsRoot extends boolean> = IsRoot extends true
  ? `${K}`
  : `.${K}` | `["${K}"]` | `['${K}']` | (K extends number ? `[${K}]` | `.[${K}]` : never)

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
