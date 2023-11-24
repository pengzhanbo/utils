/**
 * Replace all backslashes with forward slashes
 * @category String
 */
export const slash = (s: string) => s.replace(/\\/g, '/')

/**
 * First letter uppercase, other lowercase
 * @category String
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * ```
 */
export function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1).toLowerCase()
}

export function ensurePrefix(prefix: string, str: string) {
  if (str.startsWith(prefix))
    return str
  return prefix + str
}

export function ensureSuffix(suffix: string, str: string) {
  if (str.endsWith(suffix))
    return str
  return str + suffix
}

/**
 * @category String
 * @example
 * ```ts
 * kebabCase('a b c') // => a-b-c
 * kebabCase('orderBy') // => order-by
 * ```
 */
export function kebabCase(str: string) {
  return str
    .replace(/\s+/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * @category string
 * @example
 * ```ts
 * camelCase('foo bar') // => fooBar
 * camelCase('foo-bar') // => fooBar
 * ```
 */
export function camelCase(str: string) {
  return str
    .replace(/(?:-|\s)(\w)/g, (_, m) => m.toUpperCase())
}
