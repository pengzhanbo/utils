import { describe, expect, it } from 'vitest'
import { parseProtocol } from './parse-protocol'

describe('url > parseProtocol', () => {
  it('should work', () => {
    expect(parseProtocol('http://example.com')).toEqual('http')
    expect(parseProtocol('mailto:username@example.com')).toEqual('mailto')
    expect(parseProtocol('example.com')).toEqual('')
    expect(parseProtocol('//example.com')).toEqual('')
  })
})
