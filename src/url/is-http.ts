const RE_HTTP = /^(?:https?:)?\/\//i

/**
 * Check if url is http
 *
 * 检查 url 是否为 http
 *
 * @category URL
 */
export function isHttp(url: string): boolean {
  return RE_HTTP.test(url)
}
