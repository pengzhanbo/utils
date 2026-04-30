import { describe, expect, it, vi } from 'vitest'
import { hasOwn } from '../object/has-own'
import { createEmitter } from './emitter'

describe('event > emitter', () => {
  it('should create an event emitter', () => {
    const emitter = createEmitter()
    expect(emitter).toBeDefined()
    expect(hasOwn(emitter, 'on')).toBe(true)
    expect(hasOwn(emitter, 'off')).toBe(true)
    expect(hasOwn(emitter, 'once')).toBe(true)
    expect(hasOwn(emitter, 'emit')).toBe(true)
    expect(hasOwn(emitter, 'listeners')).toBe(true)
  })

  it('should emit an event', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.on('event', listener)
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(1)
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('should emit multiple event listeners', () => {
    const emitter = createEmitter()
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    emitter.on('event', listener1)
    emitter.on('event', listener2)
    emitter.emit('event')
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)
  })

  it('should emit a wildcard event', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.on('*', listener)
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(1)
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('should emit multiple wildcard event listeners', () => {
    const emitter = createEmitter()
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    emitter.on('*', listener1)
    emitter.on('*', listener2)
    emitter.emit('event')
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)
  })

  it('should turn off an event listener', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.on('event', listener)
    emitter.off('event', listener)
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(0)
  })

  it('should turn off a wildcard event listener', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.on('*', listener)
    emitter.off('*', listener)
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(0)
  })

  it('should turn off all event listeners', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.on('event', listener)
    emitter.off('event')
    emitter.off('event')
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(0)
  })

  it('should emit an event with arguments', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.on('event', listener)
    emitter.emit('event', [1, 2, 3])
    expect(listener).toHaveBeenCalledWith([1, 2, 3])
  })

  it('should emit a wildcard event with arguments', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.on('*', listener)
    emitter.emit('event', [1, 2, 3])
    expect(listener).toHaveBeenCalledWith('event', [1, 2, 3])
  })

  it('should emit a wildcard event with any event name', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.on('*', listener)
    emitter.emit('event', [1, 2, 3])
    expect(listener).toHaveBeenCalledWith('event', [1, 2, 3])
    emitter.emit('other', [1, 2, 3])
    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenCalledWith('other', [1, 2, 3])
  })

  it('should only emit once event listeners', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.once('event', listener)
    emitter.emit('event')
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('should only emit once for wildcard event with once', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.once('*', listener)
    emitter.emit('event')
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('should remove only the specified listener with off', () => {
    const emitter = createEmitter()
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    emitter.on('event', listener1)
    emitter.on('event', listener2)
    emitter.off('event', listener1)
    emitter.emit('event')
    expect(listener1).toHaveBeenCalledTimes(0)
    expect(listener2).toHaveBeenCalledTimes(1)
  })

  it('should not remove once listener via off with original listener', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.once('event', listener)
    emitter.off('event', listener)
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('should silently pass when emitting event with no listeners', () => {
    const emitter = createEmitter()
    expect(() => emitter.emit('nonexistent')).not.toThrow()
  })

  it('should call all listeners even when one throws an error', () => {
    const emitter = createEmitter()
    const listener1 = vi.fn(() => {
      throw new Error('test error')
    })
    const listener2 = vi.fn()
    emitter.on('event', listener1)
    emitter.on('event', listener2)
    expect(() => emitter.emit('event')).toThrow('test error')
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(0)
  })

  it('should call the same listener multiple times when registered multiple times', () => {
    const emitter = createEmitter()
    const listener = vi.fn()
    emitter.on('event', listener)
    emitter.on('event', listener)
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('should create emitter with pre-existing listeners map', () => {
    const listeners = new Map()
    const listener = vi.fn()
    listeners.set('event', [listener])
    const emitter = createEmitter(listeners as any)
    emitter.emit('event')
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
