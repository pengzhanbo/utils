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

const RE_SCHEMA = /^([a-z][a-z\d+\-.]*:)?\/\//i
export function isAbsoluteUrl(url: string) {
  return RE_SCHEMA.test(url)
}

export function combineURLs(baseUrl: string, ...urls: string[]) {
  if (urls.length === 0) return baseUrl
  const url = urls.join('/').replace(/\/+/g, '').replace(/^\/+/, '')
  baseUrl = baseUrl.replace(/\/+$/, '')
  return `${baseUrl}/${url}`
}
