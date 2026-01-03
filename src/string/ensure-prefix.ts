/**
 * Ensure prefix, if str does not start with prefix, it will be added
 *
 * 确保前缀，如果字符串不以前缀开头，则将添加前缀。
 *
 * @category String
 *
 * @param str - the string to check
 * @param prefix - the prefix to ensure
 *
 * @example
 * ```ts
 * ensurePrefix('example.com', 'http://') // => http://example.com
 * ensurePrefix('//example.com', '//') // => //example.com
 * ```
 */
export function ensurePrefix(str: string, prefix: string): string {
  if (!prefix)
    return str
  if (str.startsWith(prefix))
    return str
  return `${prefix}${str}`
}
