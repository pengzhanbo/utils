import { describe, expect, it, vi } from 'vitest'
import { isBrowser } from './is-browser'

describe('predicate > isBrowser', () => {
  it('should return false in Node.js environment', () => {
    expect(isBrowser()).toBe(false)
  })

  it('should return true when window is defined with document', () => {
    const mockWindow = { document: {} }
    vi.stubGlobal('window', mockWindow)
    expect(isBrowser()).toBe(true)
    vi.unstubAllGlobals()
  })

  it('should return false when window is undefined', () => {
    vi.stubGlobal('window', undefined)
    expect(isBrowser()).toBe(false)
    vi.unstubAllGlobals()
  })

  it('should return false when window exists but document is null', () => {
    vi.stubGlobal('window', { document: null })
    expect(isBrowser()).toBe(false)
    vi.unstubAllGlobals()
  })

  it('should return false when window exists but document is undefined', () => {
    vi.stubGlobal('window', { document: undefined })
    expect(isBrowser()).toBe(false)
    vi.unstubAllGlobals()
  })
})
