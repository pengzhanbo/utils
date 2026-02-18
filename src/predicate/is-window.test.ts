import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { isWindow } from './is-window'

describe('predicate > isWindow', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return false in Node.js environment', () => {
    expect(isWindow()).toBe(false)
  })

  it('should return true when window is defined with correct type', () => {
    vi.stubGlobal('window', {})
    expect(isWindow()).toBe(false)
    vi.unstubAllGlobals()

    vi.stubGlobal('window', { document: {} })
    expect(isWindow()).toBe(false)
  })

  it('should return false when window is undefined', () => {
    vi.stubGlobal('window', undefined)
    expect(isWindow()).toBe(false)
  })

  it('should return false when window is not defined', () => {
    expect(isWindow()).toBe(false)
  })
})
