import { hasOwn } from '../object'
import { isNil, isString } from '../predicate'

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
 * template('{{a}} + {{b}} = {{c}}', { a: 1, b: 2, c: 3 }) // => '1 + 2 + 3'
 * ```
 *
 * @example
 * Unclosed / overlapping placeholders are preserved as literal text:
 * ```ts
 * template('{{a hello {{b}}', { b: 'world' }) // => '{{a hello world'
 * template('{{open text', {})                    // => '{{open text'
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
  if (!prefix || !suffix) return str

  let index = str.indexOf(prefix)
  if (index === -1) return str

  const parts: string[] = []
  let lastIndex = 0

  while (index !== -1) {
    parts.push(str.slice(lastIndex, index))
    const start = index + prefix.length
    const end = str.indexOf(suffix, start)

    if (end === -1) {
      parts.push(str.slice(index))
      return parts.join('')
    }

    const key = str.slice(start, end).trim()

    if (key.includes(prefix)) {
      parts.push(prefix)
      lastIndex = index + prefix.length
      index = str.indexOf(prefix, lastIndex)
      continue
    }

    const rawValue = values[key]
    parts.push(
      hasOwn(values, key)
        ? isString(rawValue)
          ? rawValue
          : isNil(rawValue)
            ? ''
            : String(rawValue)
        : prefix + key + suffix,
    )
    lastIndex = end + suffix.length
    index = str.indexOf(prefix, lastIndex)
  }

  if (lastIndex < str.length) {
    parts.push(str.slice(lastIndex))
  }

  return parts.join('')
}
