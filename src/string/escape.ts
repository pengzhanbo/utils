const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;',
}
const RE_ESCAPE = /[&<>"'`]/g

/**
 * Converts the characters "&", "<", ">", '"', and "'" in `str` to their corresponding HTML entities.
 *
 * 将`str`中的字符"&"、"<"、">"、'"'和"'"转换为对应的HTML实体。
 *
 * @category String
 *
 * @param str - The string to escape. 要转义的字符串
 * @returns The escaped string. 转义后的字符串
 *
 * @see {@link unescape} — for the inverse operation
 * @see {@link unescape} — 反向操作
 *
 * @example
 * ```ts
 * escape('<script>alert(1)</script>') // => &lt;script&gt;alert(1)&lt;/script&gt;
 * ```
 */
export function escape(str: string): string {
  return str.replace(RE_ESCAPE, (match) => htmlEscapes[match]!)
}

const RE_ESCAPE_REGEXP = /[\\^$.*+?()[\]{}|]/g

/**
 * Escapes the RegExp special characters "^", "$", "\\", ".", "*", "+", "?", "(", ")", "[", "]", "{", "}", and "|" in `str`.
 *
 * 转义`str`中的正则表达式特殊字符"^"、"$"、"\\"、"."、"*"、"+"、"?"、"("、")"、"["、"]"、"{"、"}"以及"|"。
 *
 * @category String
 *
 * @param str - The string to escape. 要转义的字符串
 * @returns The escaped string. 转义后的字符串
 *
 * @example
 * ```ts
 * escapeRegExp('[link](https://sub.domain.com/)'); // '\[link\]\(https://sub\.domain\.com/\)'
 * ```
 */
export function escapeRegExp(str: string): string {
  return str.replace(RE_ESCAPE_REGEXP, '\\$&')
}

const RE_DECIMAL = /^[0-9]+$/
const RE_HEX = /^[0-9a-fA-F]+$/

const htmlUnescapes: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#96;': '`',
}

/**
 * Converts the HTML entities `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `str` to their corresponding characters.
 * It is the inverse of `escape`.
 *
 * 将`str`中的HTML实体`&amp;`、`&lt;`、`&gt;`、`&quot;`和`&#39;`转换回对应的字符。
 * 此操作是`escape`的逆向过程。
 *
 * @category String
 *
 * @param str - The string to unescape. 要反转义的字符串
 * @returns The unescaped string. 反转义后的字符串
 *
 * @example
 * ```ts
 * unescape('&lt;script&gt;alert(1)&lt;/script&gt;') // => <script>alert(1)</script>
 * ```
 */
export function unescape(str: string): string {
  let result = ''
  let i = 0
  const len = str.length

  while (i < len) {
    if (str[i] === '&') {
      const semi = str.indexOf(';', i + 1)
      if (semi !== -1 && semi - i < 12) {
        const entity = str.slice(i, semi + 1)
        const replacement = htmlUnescapes[entity]
        if (replacement != null) {
          result += replacement
          i = semi + 1
          continue
        }
        if (entity[1] === '#') {
          const content = entity.slice(2, -1)
          let codePoint = -1
          if (content[0] === 'x' || content[0] === 'X') {
            const hex = content.slice(1)
            if (RE_HEX.test(hex)) {
              codePoint = Number.parseInt(hex, 16)
            }
          } else if (RE_DECIMAL.test(content)) {
            codePoint = Number.parseInt(content, 10)
          }
          if (
            codePoint >= 0 &&
            // oxlint-disable-next-line unicorn/number-literal-case
            codePoint <= 0x10ffff &&
            // oxlint-disable-next-line unicorn/number-literal-case
            (codePoint < 0xd800 || codePoint > 0xdfff)
          ) {
            try {
              result += String.fromCodePoint(codePoint)
              i = semi + 1
              continue
            } catch {}
          }
        }
      }
    }
    result += str[i++]
  }

  return result
}
