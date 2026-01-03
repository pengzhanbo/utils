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
 * 将`str`中的字符"&"、"<"、">"、'"'和"'"转换为对应的HTML实体。
 *
 * @category String
 * @example
 * ```ts
 * escape('<script>alert(1)</script>') // => &lt;script&gt;alert(1)&lt;/script&gt;
 * ```
 */
export function escape(str: string): string {
  return str.replace(RE_ESCAPE, match => htmlEscapes[match]!)
}

const RE_ESCAPE_REGEXP = /[\\^$.*+?()[\]{}|]/g

/**
 * Escapes the RegExp special characters "^", "$", "\\", ".", "*", "+", "?", "(", ")", "[", "]", "{", "}", and "|" in `str`.
 *
 * 转义`str`中的正则表达式特殊字符"^"、"$"、"\\"、"."、"*"、"+"、"?"、"("、")"、"["、"]"、"{"、"}"以及"|"。
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
