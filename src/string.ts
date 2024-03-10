/**
 * Replace all backslashes with forward slashes
 * @category String
 * @example
 * ```ts
 * slash('foo\\bar') // => foo/bar
 * ```
 */
export const slash = (s: string): string => s.replace(/\\/g, '/')

/**
 * First letter uppercase, other lowercase
 * @category String
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * ```
 */
export function capitalize(s: string): string {
  return s[0].toUpperCase() + s.slice(1).toLowerCase()
}

/**
 * Ensure prefix, if str does not start with prefix, it will be added
 * @category String
 *
 * @example
 * ```ts
 * ensurePrefix('http://', 'example.com') // => http://example.com
 * ensurePrefix('//', '//example.com') // => //example.com
 * ```
 */
export function ensurePrefix(prefix: string, str: string): string {
  if (str.startsWith(prefix))
    return str
  return prefix + str
}

/**
 * Ensure suffix, if str does not end with suffix, it will be added
 * @category
 *
 * @example
 * ```ts
 * ensureSuffix('.com', 'example.com') // => example.com
 * ensureSuffix('.com', 'example') // => example.com
 * ```
 */
export function ensureSuffix(suffix: string, str: string): string {
  if (str.endsWith(suffix))
    return str
  return str + suffix
}

/**
 * Convert string to kebab-case
 * @category String
 *
 * @example
 * ```ts
 * kebabCase('a b c') // => a-b-c
 * kebabCase('orderBy') // => order-by
 * ```
 */
export function kebabCase(str: string): string {
  return str
    .replace(/\s+/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * Convert string to camelCase
 *
 * @category string
 *
 * @example
 * ```ts
 * camelCase('foo bar') // => fooBar
 * camelCase('foo-bar') // => fooBar
 * ```
 */
export function camelCase(str: string): string {
  return str
    .replace(/(?:-|\s)(\w)/g, (_, m) => m.toUpperCase())
}
