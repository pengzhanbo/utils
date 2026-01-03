import { removeLeadingSlash, removeTrailingSlash } from './slash'

/**
 * combines urls
 *
 * 合并 urls
 *
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
  const url = removeLeadingSlash(urls.join('/').replace(/\/+/g, '/'))
  baseUrl = removeTrailingSlash(baseUrl)
  return `${baseUrl}/${url}`
}
