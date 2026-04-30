const RE_PROTOCOL_MATCH = /^([-+\w]{1,25})(?::?\/\/|:)/i

/**
 * Parse protocol from URL.
 *
 * 从 URL 中解析协议。
 *
 * @category URL
 *
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
