/**
 * String template interpolation
 *
 * 字符串模板插值，支持 {{variable}} 形式的占位符
 *
 * @category String
 *
 * @param str - The template string. 模板字符串
 * @param values - An object containing values to interpolate. 包含要插值的值对象
 * @param options - Options. 选项
 * @param options.prefix - Prefix for placeholders. Default is '{{'. 占位符前缀，默认为 '{{'
 * @param options.suffix - Suffix for placeholders. Default is '}}'. 占位符后缀，默认为 '}}'
 * @returns The interpolated string. 插值后的字符串
 *
 * @example
 * ```ts
 * template('Hello, {{name}}!', { name: 'World' }) // => 'Hello, World!'
 * template('{{greeting}}, {{name}}', { greeting: 'Hi', name: 'there' }) // => 'Hi, there'
 * template('{{a}} + {{b}} = {{c}}', { a: 1, b: 2, c: 3 }) // => '1 + 2 = 3'
 * ```
 *
 * @example
 * Custom prefix/suffix:
 * ```ts
 * template('<%name%>', { name: 'World' }, { prefix: '<%', suffix: '%>' }) // => 'World'
 * ```
 */
export function template(
  str: string,
  values: Record<string, unknown>,
  options: { prefix?: string; suffix?: string } = {},
): string {
  const { prefix = '{{', suffix = '}}' } = options
  const prefixLen = prefix.length
  const suffixLen = suffix.length
  let result = ''
  let lastIndex = 0

  let index = str.indexOf(prefix)
  while (index !== -1) {
    result += str.slice(lastIndex, index)
    const start = index + prefixLen
    const end = str.indexOf(suffix, start)
    if (end === -1) {
      result += str.slice(start)
      lastIndex = str.length
      break
    }
    const key = str.slice(start, end).trim()
    const value = key in values ? String(values[key]) : `${prefix}${key}${suffix}`
    result += value
    lastIndex = end + suffixLen
    index = str.indexOf(prefix, lastIndex)
  }

  if (lastIndex < str.length) {
    result += str.slice(lastIndex)
  }

  return result
}
