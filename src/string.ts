/**
 * String Helpers
 *
 * @module String
 */

/**
 * Ensure prefix, if str does not start with prefix, it will be added
 *
 * 确保前缀，如果字符串不以前缀开头，则将添加前缀。
 *
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
 *
 * 确保后缀，如果字符串不以该后缀结尾，则将添加该后缀。
 *
 * @category String
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

export const CASE_SPLIT_PATTERN = /\p{Lu}?\p{Ll}+|\d+|\p{Lu}+(?!\p{Ll})|[\p{Emoji_Presentation}\p{Extended_Pictographic}]|\p{L}+/gu

/**
 * Split string into as words array
 *
 * 将字符串拆分为单词数组
 *
 * @category String
 * @example
 * ```ts
 * words('helloWorld🚀') // => ['hello', 'world', '🚀']
 * ```
 */
export function words(str: string): string[] {
  return Array.from(str.match(CASE_SPLIT_PATTERN) ?? [])
}

/**
 * First letter uppercase, other lowercase
 * @category String
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * ```
 */
export function capitalize(s: string): string {
  if (!s)
    return s
  return s[0].toUpperCase() + s.slice(1).toLowerCase()
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
  const parts = words(str)

  if (parts.length === 0)
    return ''

  return parts.map(word => word.toLowerCase()).join('-')
}

/**
 * Convert string to snake_case
 * @category String
 * @example
 * ```ts
 * snakeCase('a b c') // => a_b_c
 * snakeCase('orderBy') // => order_by
 * ```
 */
export function snakeCase(str: string): string {
  const parts = words(str)

  if (parts.length === 0)
    return ''

  return parts.map(word => word.toLowerCase()).join('_')
}

/**
 * Convert string to camelCase
 *
 * @category String
 *
 * @example
 * ```ts
 * camelCase('foo bar') // => fooBar
 * camelCase('foo-bar') // => fooBar
 * ```
 */
export function camelCase(str: string): string {
  const parts = words(str)

  if (parts.length === 0)
    return ''

  const [first, ...rest] = parts

  return `${first.toLowerCase()}${rest.map(word => capitalize(word)).join('')}`
}

/**
 * Convert string to lowercase
 * @category String
 * @example
 * ```ts
 * lowerCase('Hello World') // => 'hello world'
 * lowerCase('HELLO WORLD') // => 'hello world'
 * lowerCase('order-by') // => 'order by'
 * ```
 */
export function lowerCase(str: string): string {
  const parts = words(str)

  if (parts.length === 0)
    return ''

  return parts.map(word => word.toLowerCase()).join(' ')
}

/**
 * Convert string to uppercase
 * @category String
 * @example
 * ```ts
 * upperCase('Hello World') // => 'HELLO WORLD'
 * upperCase('hello world') // => 'HELLO WORLD'
 * upperCase('order-by') // => 'ORDER BY'
 * ```
 */
export function upperCase(str: string): string {
  const parts = words(str)

  if (parts.length === 0)
    return ''

  return parts.map(word => word.toUpperCase()).join(' ')
}

/**
 * Converts a string to Pascal case.
 * @category String
 * @example
 * ```ts
 * pascalCase('foo bar') // => FooBar
 * pascalCase('foo-bar') // => FooBar
 * ```
 */
export function pascalCase(str: string): string {
  const parts = words(str)

  if (parts.length === 0)
    return ''

  return parts.map(word => capitalize(word)).join('')
}

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
}
const RE_ESCAPE = /[&<>"']/g

/**
 * Converts the characters "&", "<", ">", '"', and "'" in `str` to their corresponding HTML entities.
 *
 * @category String
 * @example
 * ```ts
 * escape('<script>alert(1)</script>') // => &lt;script&gt;alert(1)&lt;/script&gt;
 * ```
 */
export function escape(str: string): string {
  return str.replace(RE_ESCAPE, match => htmlEscapes[match])
}

const RE_ESCAPE_REGEXP = /[\\^$.*+?()[\]{}|]/g

/**
 * Escapes the RegExp special characters "^", "$", "\\", ".", "*", "+", "?", "(", ")", "[", "]", "{", "}", and "|" in `str`.
 *
 * @category String
 * @example
 * ```ts
 * escapeRegExp('[link](https://sub.domain.com/)'); // '\[link\]\(https://sub\.domain\.com/\)'
 * ```
 */
export function escapeRegExp(str: string): string {
  return str.replace(RE_ESCAPE_REGEXP, '\\$&')
}

const htmlUnescapes: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': '\'',
}
const RE_UNESCAPE = /&(?:amp|lt|gt|quot|#(0+)?39);/g

/**
 * Converts the HTML entities `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `str` to their corresponding characters.
 * It is the inverse of `escape`.
 *
 * 将`str`中的HTML实体`&amp;`、`&lt;`、`&gt;`、`&quot;`和`&#39;`转换回对应的字符。
 * 此操作是`escape`的逆向过程。
 *
 * @category String
 * @example
 * ```ts
 * unescape('&lt;script&gt;alert(1)&lt;/script&gt;') // => <script>alert(1)</script>
 * ```
 */
export function unescape(str: string): string {
  return str.replace(RE_UNESCAPE, match => htmlUnescapes[match] || '\'')
}
