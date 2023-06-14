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
export const capitalize = (s: string) =>
  s[0].toUpperCase() + s.slice(1).toLowerCase()

export const ensurePrefix = (prefix: string, str: string) => {
  if (str.startsWith(prefix)) return str
  return prefix + str
}

export const ensureSuffix = (suffix: string, str: string) => {
  if (str.startsWith(suffix)) return str
  return str + suffix
}
