import { describe, expect, it } from 'vitest'
import { isHttp } from './is-http'

describe('url > isHttp', () => {
  it('should be true', () => {
    expect(isHttp('http://example.com')).toBe(true)
    expect(isHttp('https://example.com')).toBe(true)
    expect(isHttp('//example.com')).toBe(true)
  })

  it('should be false', () => {
    expect(isHttp('example.com')).toBe(false)
    expect(isHttp('mailto:username@example.com')).toBe(false)
  })
})
