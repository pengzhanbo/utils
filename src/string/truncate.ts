/**
 * Truncates a string to a specified length, adding ellipsis if truncated
 *
 * 截断字符串到指定长度，如果被截断则添加省略号
 *
 * @category String
 *
 * @param str - The string to truncate. 要截断的字符串
 * @param length - The maximum length of the result. 结果的最大长度
 * @param omission - The string to use for omission. Default is '...'. 省略符号，默认为 '...'
 * @returns The truncated string. 截断后的字符串
 *
 * @example
 * ```ts
 * truncate('hello world', 5) // => 'he...'
 * truncate('hello world', 8, '~~') // => 'hello ~~'
 * truncate('hi', 10) // => 'hi'
 * ```
 */
export function truncate(str: string, length: number, omission: string = '...'): string {
  if (Number.isNaN(length) || length < 0) return str
  const chars = [...str]
  const omissionChars = [...omission]
  if (chars.length <= length) {
    return str
  }
  if (length <= omissionChars.length) {
    return omissionChars.slice(0, length).join('')
  }
  return chars.slice(0, length - omissionChars.length).join('') + omission
}
