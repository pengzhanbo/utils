const RE_HTTP = /^(?:https?:)?\/\//i

/**
 * Check if url is http
 *
 * 检查 url 是否为 http
 *
 * @category URL
 *
 * @param url - The URL to check. 要检查的URL
 * @returns True if the URL is HTTP, false otherwise. 如果URL是HTTP则返回true，否则返回false
 *
 * @example
 * ```ts
 * isHttp('http://example.com') // true
 * isHttp('https://example.com') // true
 * isHttp('//example.com') // true
 * isHttp('ftp://example.com') // false
 * isHttp('example.com') // false
 * isHttp('mailto:username@example.com') // false
 * ```
 */
export function isHttp(url: string): boolean {
  return RE_HTTP.test(url)
}
