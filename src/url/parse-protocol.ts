const RE_PROTOCOL_MATCH = /^([-+\w]{1,25})(?::?\/\/|:)/
/**
 * Parse protocol from url
 *
 * 从 url 中解析协议
 *
 * @category URL
 * @example
 * ```ts
 * parseProtocol('http://example.com') // => http
 * parseProtocol('mailto:user@example.com') // => mailto
 * ```
 */
export function parseProtocol(url: string): string {
  const match = RE_PROTOCOL_MATCH.exec(url)
  return match?.[1] || ''
}
