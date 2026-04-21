/**
 * Check if url is valid
 *
 * 检查 url 是否有效
 *
 * @category URL
 *
 * @param url - The URL to check. 要检查的URL
 * @returns True if the URL is valid. 如果URL有效则返回true
 */
export function isUrl(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return true
  } catch {
    return false
  }
}
