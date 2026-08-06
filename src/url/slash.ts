import { ensurePrefix } from '../string/ensure-prefix.js'
import { ensureSuffix } from '../string/ensure-suffix.js'

const RE_SLASH = /\\/g
/**
 * Replace all backslashes with forward slashes
 *
 * 将所有反斜杠替换为正斜杠
 *
 * @category URL
 *
 * @param v - The string to replace backslashes in. / 要替换反斜杠的字符串
 * @returns The string with all backslashes replaced with forward slashes. / 替换所有反斜杠后的字符串
 *
 * @example
 * ```ts
 * slash('foo\\bar') // => foo/bar
 * ```
 */
export function slash(v: string): string {
  return v.replace(RE_SLASH, '/')
}

/**
 * Ensure leading slash, if str does not start with slash, it will be added.
 *
 * 确保前缀，如果字符串不以斜杠开头，则将添加斜杠。
 *
 * @category URL
 *
 * @param str - The string to ensure leading slash. / 要确保前缀的字符串
 * @returns The string with leading slash. / 确保前缀后的字符串
 *
 * @example
 * ```ts
 * ensureLeadingSlash('foo/bar') // => /foo/bar
 * ```
 */
export function ensureLeadingSlash(str: string): string {
  return ensurePrefix(slash(str), '/')
}

/**
 * Ensure trailing slash, if str does not end with slash, it will be added
 *
 * 确保后缀，如果字符串不以斜杠结尾，则将添加斜杠
 *
 * @category URL
 *
 * @param str - The string to ensure trailing slash. / 要确保后缀的字符串
 * @returns The string with trailing slash. / 确保后缀后的字符串
 *
 * @example
 * ```ts
 * ensureTrailingSlash('/foo/bar') // => /foo/bar/
 * ```
 */
export function ensureTrailingSlash(str: string): string {
  return ensureSuffix(slash(str), '/')
}

/**
 * Remove leading slash, if str starts with slash, it will be removed.
 *
 * 删除斜杆前缀，如果字符串以斜杠开头，则将删除。
 *
 * @category URL
 *
 * @param str - The string to remove leading slash. / 要删除前缀的字符串
 * @returns The string with leading slash. / 删除前缀后的字符串
 *
 * @example
 * ```ts
 * removeLeadingSlash('/foo/bar') // => foo/bar
 * ```
 */
export function removeLeadingSlash(str: string): string {
  if (!str) {
    return str
  }

  str = slash(str)
  return str[0] === '/' ? str.slice(1) : str
}

/**
 * Remove trailing slash, if str ends with slash, it will be removed.
 *
 * 删除斜杆后缀，如果字符串以斜杠结尾，则将删除。
 *
 * @category URL
 *
 * @param str - The string to remove trailing slash. / 要删除后缀的字符串
 * @returns The string with trailing slash. / 删除后缀后的字符串
 *
 * @example
 * ```ts
 * removeTrailingSlash('/foo/bar/') // => /foo/bar
 * ```
 */
export function removeTrailingSlash(str: string): string {
  if (!str) {
    return str
  }

  str = slash(str)
  return str[str.length - 1] === '/' ? str.slice(0, -1) : str
}
