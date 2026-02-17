/**
 * Ensure suffix, if str does not end with suffix, it will be added
 *
 * 确保后缀，如果字符串不以该后缀结尾，则将添加该后缀。
 *
 * @category String
 *
 * @param str - The string to check. 要检查的字符串
 * @param suffix - The suffix to ensure. 要确保的后缀
 * @returns The string with the suffix ensured. 确保后缀后的字符串
 *
 * @example
 * ```ts
 * ensureSuffix('example.com', '.com') // => example.com
 * ensureSuffix('example', '.com') // => example.com
 * ```
 */
export function ensureSuffix(str: string, suffix: string): string {
  if (!suffix) return str

  if (str.endsWith(suffix)) return str
  return str + suffix
}
