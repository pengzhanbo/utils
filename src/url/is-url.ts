/**
 * Check if URL is valid.
 *
 * 检查 URL 是否有效。
 *
 * @category URL
 *
 * @param url - The URL to check. 要检查的 URL
 *
 * @returns True if the URL is valid. 如果 URL 有效则返回 true
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
