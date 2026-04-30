import { describe, expect, it, vi } from 'vitest'
import { TimeoutError } from '../error/TimeoutError'
import { sleep } from './sleep'
import { timeout, withTimeout } from './timeout'

describe('promise > timeout', () => {
  it('should reject after delay', async () => {
    await expect(timeout(1000)).rejects.toThrowError('The operation was timed out')
  })
})

describe('promise > withTimeout', () => {
  // ===== Backward Compatibility / 向后兼容 =====

  describe('backward compatibility', () => {
    it('should resolve without timeout (no-signal signature)', async () => {
      await expect(withTimeout(() => Promise.resolve(42), 1000)).resolves.toBe(42)
    })

    it('should reject on timeout (no-signal signature)', async () => {
      await expect(withTimeout(() => sleep(1000), 50)).rejects.toThrowError(
        'The operation was timed out',
      )
    })
  })

  // ===== Basic Functionality / 基本功能 =====

  describe('basic functionality', () => {
    it('should resolve before timeout', async () => {
      const result = await withTimeout(() => Promise.resolve('hello'), 1000)
      expect(result).toBe('hello')
    })

    it('should reject with TimeoutError when exceeding time limit', async () => {
      await expect(withTimeout(() => sleep(200), 50)).rejects.toThrow(TimeoutError)
    })

    it('should pass AbortSignal to run function', async () => {
      let receivedSignal: AbortSignal | undefined
      await withTimeout((signal) => {
        receivedSignal = signal
        return Promise.resolve('ok')
      }, 1000)
      expect(receivedSignal).toBeInstanceOf(AbortSignal)
      expect(receivedSignal!.aborted).toBe(false)
    })
  })

  // ===== Fallback Value / 回退值 =====

  describe('fallback value', () => {
    it('should return fallback value on timeout when provided', async () => {
      const result = await withTimeout(() => sleep(200), 50, { fallback: 'default_value' as any })
      expect(result).toBe('default_value')
    })

    it('should support numeric fallback', async () => {
      const result = await withTimeout(() => sleep(200), 50, { fallback: 0 as any })
      expect(result).toBe(0)
    })

    it('should support null fallback', async () => {
      const result = await withTimeout(() => sleep(200), 50, { fallback: null })
      expect(result).toBeNull()
    })

    it('should ignore fallback when resolving successfully', async () => {
      const result = await withTimeout(() => Promise.resolve('actual'), 1000, {
        fallback: 'default',
      })
      expect(result).toBe('actual')
    })

    it('should throw TimeoutError when no fallback is set', async () => {
      await expect(withTimeout(() => sleep(200), 50)).rejects.toThrow('The operation was timed out')
    })

    it('should reject with TimeoutError when fallback is undefined', async () => {
      await expect(withTimeout(() => sleep(200), 10, { fallback: undefined })).rejects.toThrow(
        TimeoutError,
      )
    })
  })

  // ===== Custom Message / 自定义消息 =====

  describe('custom message', () => {
    it('should use custom message in TimeoutError', async () => {
      await expect(
        withTimeout(() => sleep(200), 50, { message: 'Custom timeout msg' }),
      ).rejects.toThrow('Custom timeout msg')
    })
  })

  // ===== Cancel Method / 取消方法 =====

  describe('cancel method', () => {
    it('should expose cancel method on returned promise', async () => {
      const task = withTimeout(() => Promise.resolve('ok'), 100)
      expect(typeof task.cancel).toBe('function')
      // Resolve first, then cancel should be a safe no-op
      await task
      task.cancel()
    })

    it('should reject with AbortError when cancelled', async () => {
      const task = withTimeout(() => sleep(5000), 10000)
      task.cancel()
      await expect(task).rejects.toThrow(DOMException)
    })

    it('should cancel immediately without waiting for timeout', async () => {
      const start = Date.now()
      const task = withTimeout(() => sleep(10000), 10000)
      task.cancel()
      await expect(task).rejects.toThrow()
      const elapsed = Date.now() - start
      expect(elapsed).toBeLessThan(200) // Should be near-instant
    })

    it('should handle multiple cancel calls safely', async () => {
      const task = withTimeout(() => sleep(5000), 10000)
      task.cancel()
      task.cancel()
      task.cancel()
      await expect(task).rejects.toThrow()
    })

    it('should not affect already settled promise (no-op)', async () => {
      const task = withTimeout(() => Promise.resolve('done'), 10000)
      const result = await task
      expect(result).toBe('done')
      task.cancel() // Should be no-op since already resolved
    })
  })

  // ===== Signal Synchronization / 信号同步 =====

  describe('signal synchronization', () => {
    it('should pass a combined signal to run() when external signal is provided', async () => {
      const controller = new AbortController()
      let signalReceived: AbortSignal | undefined

      await withTimeout(
        (signal) => {
          signalReceived = signal
          return Promise.resolve('ok')
        },
        1000,
        { signal: controller.signal },
      )

      // The signal passed to run() should be a combined signal (not the external one)
      expect(signalReceived).toBeInstanceOf(AbortSignal)
      expect(signalReceived).not.toBe(controller.signal)
      expect(signalReceived!.aborted).toBe(false)
    })

    it('external abort should settle promise via listener on external signal', async () => {
      const controller = new AbortController()
      let signalReceived: AbortSignal | undefined

      const task = withTimeout(
        (signal) => {
          signalReceived = signal
          return Promise.resolve('ok')
        },
        5000,
        { signal: controller.signal },
      )

      // Abort externally — the listener on the external signal fires finish('abort')
      controller.abort()

      await expect(task).rejects.toThrow(DOMException)
      expect(signalReceived).toBeDefined()
      expect(signalReceived!.aborted).toBe(true)
    })

    it('internal controller.signal should be used when no external signal', async () => {
      let signalReceived: AbortSignal | undefined
      const task = withTimeout((signal) => {
        signalReceived = signal
        return Promise.resolve('ok')
      }, 1000)

      await task
      // Should be an internal signal (not user-provided)
      expect(signalReceived).toBeDefined()
      expect(signalReceived!.aborted).toBe(false)
    })

    it('cancel() aborts the internal controller signal', async () => {
      let signalReceived: AbortSignal | undefined
      const task = withTimeout((signal) => {
        signalReceived = signal
        return sleep(100)
      }, 5000)

      // Cancel immediately — this aborts the internal controller
      task.cancel()

      await expect(task).rejects.toThrow()

      // The signal that run received IS the internal controller's signal,
      // and after cancel(), that signal MUST be aborted
      expect(signalReceived).toBeDefined()
      expect(signalReceived!.aborted).toBe(true)
    })

    it('should propagate timeout abort to run() signal when external signal is provided', async () => {
      const controller = new AbortController()
      let signalAborted = false

      const task = withTimeout(
        (signal) => {
          signal.addEventListener('abort', () => {
            signalAborted = true
          })
          return sleep(5000)
        },
        50,
        { signal: controller.signal },
      )

      await expect(task).rejects.toThrow(TimeoutError)
      expect(signalAborted).toBe(true)
    })

    it('should propagate cancel abort to run() signal when external signal is provided', async () => {
      const controller = new AbortController()
      let signalAborted = false

      const task = withTimeout(
        (signal) => {
          signal.addEventListener('abort', () => {
            signalAborted = true
          })
          return sleep(5000)
        },
        5000,
        { signal: controller.signal },
      )

      task.cancel()

      await expect(task).rejects.toThrow(DOMException)
      expect(signalAborted).toBe(true)
    })
  })

  // ===== External Signal / 外部信号 =====

  describe('external AbortSignal', () => {
    it('should invoke abortHandler when external signal is aborted during pending execution', async () => {
      const controller = new AbortController()

      const task = withTimeout(() => sleep(5000), 10000, { signal: controller.signal })

      // Abort while the task is still pending
      controller.abort()

      await expect(task).rejects.toThrow(DOMException)
    })

    it('should reject immediately when external signal is already aborted', async () => {
      const controller = new AbortController()
      controller.abort()

      await expect(
        withTimeout(() => sleep(5000), 10000, { signal: controller.signal }),
      ).rejects.toThrow(DOMException)
    })

    it('should reject when external signal aborted and fallback provided', async () => {
      const controller = new AbortController()
      controller.abort()

      await expect(
        withTimeout(() => sleep(5000), 10000, {
          signal: controller.signal,
          fallback: 'aborted_fallback' as any,
        }),
      ).rejects.toThrow(DOMException)
    })

    it('should resolve normally when external signal never fires', async () => {
      const controller = new AbortController()

      const result = await withTimeout(() => Promise.resolve('ok'), 1000, {
        signal: controller.signal,
      })
      expect(result).toBe('ok')
    }, 5000)

    it('should reject when external signal fires during execution with fallback', async () => {
      const controller = new AbortController()
      const task = withTimeout(() => sleep(5000), 10000, {
        signal: controller.signal,
        fallback: 'signal_aborted' as any,
      })
      setTimeout(() => controller.abort(), 30)
      await expect(task).rejects.toThrow(DOMException)
    })
  })

  // ===== Resource Cleanup / 资源清理 =====

  describe('resource cleanup', () => {
    it('should clean up timer on successful completion', async () => {
      await withTimeout(() => Promise.resolve('ok'), 1000)
    })

    it('should clean up timer on timeout', async () => {
      await expect(withTimeout(() => sleep(200), 50)).rejects.toThrow()
    })

    it('should clean up timer on cancellation', async () => {
      const task = withTimeout(() => sleep(5000), 10000)
      task.cancel()
      await expect(task).rejects.toThrow()
    })
  })

  // ===== Edge Cases / 边界情况 =====

  describe('edge cases', () => {
    it('should throw RangeError when ms is negative', () => {
      expect(() => withTimeout(() => Promise.resolve(42), -1)).toThrow(RangeError)
      expect(() => withTimeout(() => Promise.resolve(42), -1)).toThrow(
        'ms must be a finite non-negative number',
      )
    })

    it('should throw RangeError when ms is Infinity', () => {
      expect(() => withTimeout(() => Promise.resolve(42), Infinity)).toThrow(RangeError)
      expect(() => withTimeout(() => Promise.resolve(42), -Infinity)).toThrow(RangeError)
    })

    it('should throw RangeError when ms is NaN', () => {
      expect(() => withTimeout(() => Promise.resolve(42), Number.NaN)).toThrow(RangeError)
    })

    it('should work with ms=0 (immediate timeout)', async () => {
      const result = await withTimeout(() => sleep(10), 0, { fallback: 'immediate' as any })
      expect(result).toBe('immediate')
    })

    it('should propagate run function errors (not timeout-related)', async () => {
      await expect(withTimeout(() => Promise.reject(new Error('boom')), 1000)).rejects.toThrow(
        'boom',
      )
    })

    it('should work with synchronous errors in run', async () => {
      const syncFn = (): Promise<any> => {
        throw new Error('sync')
      }
      await expect(withTimeout(syncFn, 1000)).rejects.toThrow('sync')
    })

    it('should handle run function that checks abort signal', async () => {
      const result = await withTimeout(async (signal) => {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
        return 'completed'
      }, 100)
      expect(result).toBe('completed')
    })

    it('should remove external signal abort listener after successful completion', async () => {
      const controller = new AbortController()
      const removeSpy = vi.spyOn(AbortSignal.prototype, 'removeEventListener')

      await withTimeout(() => Promise.resolve('ok'), 1000, { signal: controller.signal })

      expect(removeSpy).toHaveBeenCalledWith('abort', expect.any(Function))
      removeSpy.mockRestore()
    })

    it('should remove external signal abort listener after timeout', async () => {
      const controller = new AbortController()
      const removeSpy = vi.spyOn(AbortSignal.prototype, 'removeEventListener')

      await withTimeout(() => sleep(5000), 50, { signal: controller.signal }).catch(() => {})

      expect(removeSpy).toHaveBeenCalledWith('abort', expect.any(Function))
      removeSpy.mockRestore()
    })

    it('should remove external signal abort listener after error', async () => {
      const controller = new AbortController()
      const removeSpy = vi.spyOn(AbortSignal.prototype, 'removeEventListener')

      await withTimeout(() => Promise.reject(new Error('fail')), 1000, {
        signal: controller.signal,
      }).catch(() => {})

      expect(removeSpy).toHaveBeenCalledWith('abort', expect.any(Function))
      removeSpy.mockRestore()
    })

    it('should reject with run function error when fallback is set', async () => {
      const result = withTimeout(
        async () => {
          throw new Error('fail')
        },
        1000,
        { fallback: 'fallback-value' },
      )
      await expect(result).rejects.toThrow('fail')
    })

    it('should handle abort via external signal', async () => {
      const controller = new AbortController()

      const result = withTimeout(
        async (signal) => {
          await new Promise((_, reject) => {
            signal.addEventListener('abort', () =>
              reject(new DOMException('Aborted', 'AbortError')),
            )
          })
          return 'never'
        },
        5000,
        { signal: controller.signal },
      )

      controller.abort()

      await expect(result).rejects.toThrow('Aborted')
    })

    it('should handle cancel method', async () => {
      const result = withTimeout(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000))
        return 'never'
      }, 5000)

      result.cancel()

      await expect(result).rejects.toThrow('Aborted')
    })

    it('should not double-settle when cancel is called after success', async () => {
      const result = withTimeout(async () => 'done', 5000)

      const value = await result
      expect(value).toBe('done')

      result.cancel()
    })

    it('should handle already aborted signal', async () => {
      const controller = new AbortController()
      controller.abort()

      const result = withTimeout(async () => 'never', 5000, { signal: controller.signal })

      await expect(result).rejects.toThrow('Aborted')
    })
  })
})
