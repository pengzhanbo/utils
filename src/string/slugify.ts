// oxlint-disable-next-line no-control-regex
const CONTROL_REG = /[\u0000-\u001F]/g
const SPECIAL_REG = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g
const COMBINING_REG = /\p{Mn}/gu

/**
 * Converts a string to a URL-friendly slug
 *
 * 将字符串转换为 URL 友好的 slug
 *
 * @category String
 *
 * @param str - The string to slugify. 要转换的字符串
 * @returns The slugified string. Slug 格式的字符串
 *
 * @example
 * ```ts
 * slugify('Hello World') // => 'hello-world'
 * slugify('foo  bar baz') // => 'foo-bar-baz'
 * slugify('What???') // => 'what'
 * ```
 */
export function slugify(str: string): string {
  if (!str) return ''

  return (
    str
      .normalize('NFKD')
      // Remove accents
      .replace(COMBINING_REG, '')
      // Remove control characters
      .replace(CONTROL_REG, '')
      // Replace special characters
      .replace(SPECIAL_REG, '-')
      // Remove continuos separators
      .replace(/-{2,}/g, '-')
      // Remove prefixing and trailing separators
      .replace(/^-+|-+$/g, '')
      // ensure it doesn't start with a number
      .replace(/^(\d)/, '_$1')
      // lowercase
      .toLowerCase()
  )
}
