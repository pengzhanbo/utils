const RE_HTTP = /^(https?:)?\/\//i
/**
 *
 * @category URL
 */
export function isHttp(url: string) {
  return RE_HTTP.test(url)
}

export function isUrl(url: string) {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return true
  } catch {
    return false
  }
}

const RE_PROTOCOL = /^([a-z][a-z\d+\-.]*:)?\/\//i
export function isAbsoluteUrl(url: string) {
  return RE_PROTOCOL.test(url)
}

export function combineURLs(baseUrl: string, ...urls: string[]) {
  if (urls.length === 0) return baseUrl
  const url = urls.join('/').replace(/\/+/g, '').replace(/^\/+/, '')
  baseUrl = baseUrl.replace(/\/+$/, '')
  return `${baseUrl}/${url}`
}

const RE_PROTOCOL_MATCH = /^([-+\w]{1,25})(:?\/\/|:)/
export default function parseProtocol(url: string) {
  const match = RE_PROTOCOL_MATCH.exec(url)
  return (match && match[1]) || ''
}
