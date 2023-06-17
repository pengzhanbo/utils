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
