import { removeLeadingSlash, removeTrailingSlash, slash } from './slash'

const MULTI_SLASH = /(?<!:)\/+/g

/**
 * Combines URLs.
 *
 * 合并 URLs。
 *
 * @category URL
 *
 * @param baseUrl - The base URL. 基础 URL
 * @param urls - The URLs to combine. 要合并的 URL
 *
 * @returns The combined URL. 合并后的 URL
 *
 * @example
 * ```ts
 * combineURLs('http://example.com', 'foo', 'bar') // => http://example.com/foo/bar
 * combineURLs('//example.com', '/foo') // => //example.com/foo
 * combineURLs('/foo', 'bar', 'index.html') // => /foo/bar/index.html
 * ```
 */
export function combineURLs(baseUrl: string, ...urls: string[]): string {
  if (urls.length === 0) return baseUrl
  const url = slash(removeLeadingSlash(urls.join('/'))).replace(MULTI_SLASH, '/')
  if (!baseUrl) return url
  baseUrl = removeTrailingSlash(baseUrl)
  return `${baseUrl}/${url}`
}
