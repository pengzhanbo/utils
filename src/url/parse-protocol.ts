const RE_PROTOCOL_MATCH = /^([-+\w]{1,25})(?::?\/\/|:)/i

/**
 * Parse protocol from URL.
 *
 * 从 URL 中解析协议。
 *
 * @category URL
 *
 * @param url - The URL to parse the protocol from.
 * @returns The protocol extracted from the URL.
 * @throws {Error} If the URL is not a valid URL.
 *
 * @example
 * ```ts
 * parseProtocol('http://example.com') // => http
 * parseProtocol('mailto:user@example.com') // => mailto
 * ```
 */
export function parseProtocol(url: string): string {
  const match = RE_PROTOCOL_MATCH.exec(url)
  return match?.[1] ?? ''
}
