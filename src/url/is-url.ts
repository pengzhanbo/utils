/**
 * Check if url is valid
 *
 * 检查 url 是否有效
 *
 * @category URL
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
