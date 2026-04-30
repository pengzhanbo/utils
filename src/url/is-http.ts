const RE_HTTP = /^(?:https?:)?\/\//i

/**
 * Check if URL is HTTP.
 *
 * 检查 URL 是否为 HTTP。
 *
 * @category URL
 *
 * @param url - The URL to check. 要检查的 URL
 *
 * @returns True if the URL is HTTP, false otherwise. 如果 URL 是 HTTP 则返回 true，否则返回 false
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
