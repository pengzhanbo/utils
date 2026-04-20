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
 * truncate('hello world', 5) // => 'hello...'
 * truncate('hello world', 8, '~~') // => 'hello w~~'
 * truncate('hi', 10) // => 'hi'
 * ```
 */
export function truncate(str: string, length: number, omission: string = '...'): string {
  if (str.length <= length) {
    return str
  }

  const omissionLen = omission.length
  if (length <= omissionLen) {
    return omission.slice(0, length)
  }

  return str.slice(0, length - omissionLen) + omission
}
