/**
 * URL Helpers
 *
 * @module URL
 */

import { ensurePrefix, ensureSuffix } from './string'

const RE_SLASH = /\\/g
/**
 * Replace all backslashes with forward slashes
 *
 * 将所有反斜杠替换为正斜杠
 *
 * @category String
 * @example
 * ```ts
 * slash('foo\\bar') // => foo/bar
 * ```
 */
export function slash(s: string): string {
  return s.replace(RE_SLASH, '/')
}

/**
 * Ensure leading slash, if str does not start with slash, it will be added
 *
 * 确保前缀，如果字符串不以斜杠开头，则将添加斜杠
 *
 * @category String
 * @example
 * ```ts
 * ensureLeadingSlash('foo/bar') // => /foo/bar
 * ```
 */
export function ensureLeadingSlash(str: string): string {
  return ensurePrefix(slash(str), '/')
}

/**
 * Ensure trailing slash, if str does not end with slash, it will be added
 *
 * 确保后缀，如果字符串不以斜杠结尾，则将添加斜杠
 *
 * @category String
 * @example
 * ```ts
 * ensureTrailingSlash('/foo/bar') // => /foo/bar/
 * ```
 */
export function ensureTrailingSlash(str: string): string {
  return ensureSuffix(slash(str), '/')
}

/**
 * Remove leading slash, if str starts with slash, it will be removed
 *
 * 删除斜杆前缀，如果字符串以斜杠开头，则将删除
 *
 * @category String
 * @example
 * ```ts
 * removeLeadingSlash('/foo/bar') // => foo/bar
 * ```
 */
export function removeLeadingSlash(str: string): string {
  if (!str)
    return str

  str = slash(str)
  return str[0] === '/' ? str.slice(1) : str
}

/**
 * Remove trailing slash, if str ends with slash, it will be removed
 *
 * 删除斜杆后缀，如果字符串以斜杠结尾，则将删除
 *
 * @category String
 * @example
 * ```ts
 * removeTrailingSlash('/foo/bar/') // => /foo/bar
 * ```
 */
export function removeTrailingSlash(str: string): string {
  if (!str)
    return str

  str = slash(str)
  return str[str.length - 1] === '/' ? str.slice(0, -1) : str
}

const RE_HTTP = /^(?:https?:)?\/\//i
/**
 * Check if url is http
 * @category URL
 */
export function isHttp(url: string): boolean {
  return RE_HTTP.test(url)
}

/**
 * Check if url is valid
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
  const url = removeLeadingSlash(urls.join('/').replace(/\/+/g, '/'))
  baseUrl = removeTrailingSlash(baseUrl)
  return `${baseUrl}/${url}`
}

const RE_PROTOCOL_MATCH = /^([-+\w]{1,25})(?::?\/\/|:)/
/**
 * Parse protocol from url
 *
 * @category URL
 * @example
 * ```ts
 * parseProtocol('http://example.com') // => http
 * parseProtocol('mailto:user@example.com') // => mailto
 * ```
 */
export function parseProtocol(url: string): string {
  const match = RE_PROTOCOL_MATCH.exec(url)
  return match?.[1] || ''
}
