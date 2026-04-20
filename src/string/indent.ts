/**
 * Adds indentation to each line of a string
 *
 * 为字符串的每行添加缩进
 *
 * @category String
 *
 * @param str - The string to indent. 要缩进的字符串
 * @param indent - The indentation string. Default is '  ' (two spaces). 缩进字符串，默认为两个空格
 * @returns The indented string. 缩进后的字符串
 *
 * @example
 * ```ts
 * indent('hello\nworld', '  ') // => '  hello\n  world'
 * indent('foo\nbar', '\t') // => '\tfoo\n\tbar'
 * ```
 */
export function indent(str: string, indent: string = '  '): string {
  if (!str) return str

  const lines = str.split('\n')
  return lines.map((line) => `${indent}${line}`).join('\n')
}
