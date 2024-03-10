const RE_HTTP = /^(https?:)?\/\//i
/**
 *
 * @category URL
 */
export function isHttp(url: string): boolean {
  return RE_HTTP.test(url)
}

/**
 * @category URL
 */
export function isUrl(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return true
  }
  catch {
    return false
  }
}

const RE_PROTOCOL = /^([a-z][a-z\d+\-.]*:)?\/\//i
/**
 * @category URL
 */
export function isAbsoluteUrl(url: string): boolean {
  return RE_PROTOCOL.test(url)
}

/**
 * combines urls
 * @category URL
 * @example
 * ```ts
 * combineURLs('http://example.com', 'foo', 'bar') // => http://example.com/foo/bar
 * combineURLs('//example.com', '/foo') // => //example.com/foo
 * combineURLs('/foo', 'bar', 'index.html') // => /foo/bar/index.html
 * ```
 */
export function combineURLs(baseUrl: string, ...urls: string[]): string {
  if (urls.length === 0)
    return baseUrl
  const url = urls.join('/').replace(/\/\/+/g, '/').replace(/^\/+/, '')
  baseUrl = baseUrl.replace(/\/+$/, '')
  return `${baseUrl}/${url}`
}

const RE_PROTOCOL_MATCH = /^([-+\w]{1,25})(:?\/\/|:)/
/**
 * @category URL
 * @example
 * ```ts
 * parseProtocol('http://example.com') // => http
 * parseProtocol('mailto:user@example.com') // => mailto
 * ```
 */
export function parseProtocol(url: string): string {
  const match = RE_PROTOCOL_MATCH.exec(url)
  return (match && match[1]) || ''
}
