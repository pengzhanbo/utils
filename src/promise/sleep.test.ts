import { performance } from 'node:perf_hooks'
import { describe, expect, it, vi } from 'vitest'
import { sleep } from './sleep'

describe('promise > sleep', () => {
  it('pauses an async function for a given time', async () => {
    const start = performance.now()
    await sleep(100)
    const end = performance.now()

    expect(end - start).greaterThanOrEqual(99)
  })

  it('should cancel the sleep if aborted via AbortSignal', async () => {
    const controller = new AbortController()
    const signal = controller.signal

    setTimeout(() => controller.abort(), 50)

    await expect(sleep(100, { signal })).rejects.toThrow('The operation was aborted')
  })

  it('should not call the sleep if it is already aborted by AbortSignal', async () => {
    const controller = new AbortController()
    const { signal } = controller
    const spy = vi.spyOn(globalThis, 'setTimeout')

    controller.abort()

    await expect(sleep(100, { signal })).rejects.toThrow('The operation was aborted')

    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should clear timeout when aborted by AbortSignal', async () => {
    const controller = new AbortController()
    const { signal } = controller
    const spy = vi.spyOn(globalThis, 'clearTimeout')
    const promise = sleep(100, { signal })

    controller.abort()

    await expect(promise).rejects.toThrow('The operation was aborted')

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should clear event listener if timeout completes', async () => {
    const controller = new AbortController()
    const { signal } = controller
    const spy = vi.spyOn(signal, 'removeEventListener')

    await sleep(100, { signal })

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
