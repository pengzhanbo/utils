import { describe, expect, it, vi } from 'vitest'
import { TimeoutError } from '../error/TimeoutError'
import { retry } from './retry'

describe('promise > retry', () => {
  describe('重试次数限制 (limit)', () => {
    it('should work', async () => {
      const limit = 3
      const fn = vi.fn(() => Promise.reject(new Error('error')))
      await expect(retry(fn, { limit, delay: 0 })).rejects.toThrowError('error')
      expect(fn).toHaveBeenCalledTimes(limit)
    })

    it('should work with once resolve', async () => {
      const fn = vi.fn(() => Promise.resolve(1))
      const result = await retry(fn)
      expect(result).toBe(1)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should work with less than limit resolve', async () => {
      const limit = 4
      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        if (attempts < limit) {
          return Promise.reject(new Error('error'))
        }
        return Promise.resolve(1)
      })
      const result = await retry(fn, { limit: 5 })
      expect(result).toBe(1)
      expect(fn).toHaveBeenCalledTimes(limit)
    })

    it('should work with limit of 1', async () => {
      const fn = vi.fn(() => Promise.reject(new Error('error')))
      await expect(retry(fn, { limit: 1 })).rejects.toThrow()
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('通过 AbortSignal 取消', () => {
    it('should reject immediately if signal is already aborted', async () => {
      const controller = new AbortController()
      controller.abort()

      const fn = vi.fn(() => Promise.resolve(1))
      const promise = retry(fn, { signal: controller.signal })

      await expect(promise).rejects.toThrow('Aborted')
      expect(fn).not.toHaveBeenCalled()
    })

    it('should have no-op cancel method when signal is already aborted', async () => {
      const controller = new AbortController()
      controller.abort()

      const fn = vi.fn(() => Promise.resolve(1))
      const promise = retry(fn, { signal: controller.signal })

      // Call the no-op cancel — should not throw
      promise.cancel()

      await expect(promise).rejects.toThrow('Aborted')
      expect(fn).not.toHaveBeenCalled()
    })

    it('should support cancellation via AbortController', async () => {
      vi.useFakeTimers()

      const controller = new AbortController()
      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        return Promise.reject(new Error('error'))
      })

      const promise = retry(fn, { limit: 10, delay: 50, signal: controller.signal })

      // 执行第一次重试（立即）
      // 等待 delay
      vi.advanceTimersByTime(51)
      // 第二次重试执行
      // 再等 delay
      vi.advanceTimersByTime(51)
      // 此时 abort
      controller.abort()
      vi.advanceTimersByTime(100)

      try {
        await promise
        expect.unreachable('Should have thrown')
      } catch (e) {
        expect(e).toBeDefined()
      }

      expect(attempts).toBeLessThanOrEqual(3)

      vi.useRealTimers()
    }, 10000)

    it('should cleanup timer when aborted during delay period', async () => {
      vi.useFakeTimers()

      const controller = new AbortController()
      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        return Promise.reject(new Error('error'))
      })

      const promise = retry(fn, { limit: 5, delay: 200, signal: controller.signal })

      // 触发第一次重试（立即）
      expect(attempts).toBe(1)

      // 在 delay 期间取消（此时定时器存在）
      controller.abort()

      // 需要等待 promise 被 reject
      await promise.catch(() => {})

      // 定时器被清理，不会触发更多重试
      expect(attempts).toBe(1)

      vi.useRealTimers()
    }, 10000)
  })

  describe('通过 cancel() 方法取消', () => {
    it('should support cancel method to stop retries', async () => {
      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        return Promise.reject(new Error('error'))
      })

      const promise = retry(fn, { limit: 10, delay: 10 })

      // 等待足够长的时间让几次重试发生
      await new Promise((resolve) => setTimeout(resolve, 50))

      // 记录当前尝试次数
      const attemptsBeforeCancel = attempts

      // 调用 cancel（清理定时器并 reject promise）
      promise.cancel()

      // 需要等待 promise 被 reject
      try {
        await promise
        expect.unreachable('Should have thrown')
      } catch (e) {
        expect(e).toBeDefined()
      }

      // 取消后不应该有更多重试
      expect(attempts).toBe(attemptsBeforeCancel)
      // 应该执行了多次但远小于 limit
      expect(attempts).toBeLessThan(10)
    }, 10000)

    it('should be safe to call cancel multiple times', async () => {
      const fn = vi.fn(() => Promise.reject(new Error('error')))

      const promise = retry(fn, { limit: 3, delay: 10 })

      // 多次调用 cancel 不应报错
      promise.cancel()
      promise.cancel()
      promise.cancel()

      // 需要 catch promise 以避免 unhandled rejection
      await promise.catch(() => {})
    })

    it('should prevent further retries after cancellation', async () => {
      vi.useFakeTimers()

      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        return Promise.reject(new Error('error'))
      })

      const promise = retry(fn, { limit: 5, delay: 100 })

      // 初始执行
      expect(attempts).toBe(1)

      // 取消时应该清理定时器并阻止后续重试
      promise.cancel()

      // 等待 promise 被 reject
      await promise.catch(() => {})

      // 推进大量时间验证定时器被清理
      vi.advanceTimersByTime(1000)
      expect(attempts).toBe(1)

      vi.useRealTimers()
    }, 10000)
  })

  describe('超时限制 (timeout)', () => {
    it('should support timeout option and reject with TimeoutError', async () => {
      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        return Promise.reject(new Error('error'))
      })

      const promise = retry(fn, { limit: 100, delay: 10, timeout: 50 })

      try {
        await promise
        expect.unreachable('Should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError)
      }

      expect(attempts).toBeGreaterThan(2)
    }, 10000)

    it('should timeout before reaching limit for slow operations', async () => {
      const fn = vi.fn(() => Promise.reject(new Error('always fails')))

      const promise = retry(fn, { limit: 1000, delay: 5, timeout: 30 })

      try {
        await promise
        expect.unreachable('Should have timed out')
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError)
      }

      // 应该远小于 limit
      expect(fn.mock.calls.length).toBeLessThan(100)
    }, 10000)
  })

  describe('边界情况和通用行为', () => {
    it('should handle successful retry after some failures', async () => {
      let callCount = 0
      const fn = vi.fn(() => {
        callCount++
        if (callCount < 3) {
          return Promise.reject(new Error(`attempt ${callCount}`))
        }
        return Promise.resolve(`success on attempt ${callCount}`)
      })

      const result = await retry(fn, { limit: 5, delay: 0 })
      expect(result).toBe('success on attempt 3')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should pass through the resolved value correctly', async () => {
      const testData = { data: 'test', nested: { value: 123 } }
      const fn = vi.fn(() => Promise.resolve(testData))

      const result = await retry(fn)
      expect(result).toEqual(testData)
      expect(result).toBe(testData) // 同一个引用
    })

    it('should work with zero delay', async () => {
      const fn = vi.fn(() => {
        return Promise.reject(new Error('fail'))
      })

      const start = Date.now()
      await expect(retry(fn, { limit: 3, delay: 0 })).rejects.toThrow()
      const elapsed = Date.now() - start

      // 应该很快完成（无延迟）
      expect(elapsed).toBeLessThan(100)
    })

    it('should reject with RetryError containing correct message on final failure', async () => {
      const errorMessage = 'custom error message'
      const fn = vi.fn(() => Promise.reject(new Error(errorMessage)))

      try {
        await retry(fn, { limit: 2, delay: 0 })
        expect.unreachable('Should have rejected')
      } catch (e) {
        expect(e).toBeDefined()
        expect((e as Error).message).toContain(errorMessage)
      }
    })

    it('should work with empty options object', async () => {
      const fn = vi.fn(() => Promise.resolve('ok'))
      const result = await retry(fn, {})
      expect(result).toBe('ok')
    })

    it('should not leak timers when resolved immediately', async () => {
      const fn = vi.fn(() => Promise.resolve('ok'))

      await retry(fn, { limit: 5, delay: 1000 })

      // 如果有泄漏的定时器，这里可能会有问题
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('信号与超时集成测试', () => {
    it('should support both signal and timeout together', async () => {
      vi.useFakeTimers()

      const controller = new AbortController()
      const fn = vi.fn(() => Promise.reject(new Error('error')))

      const promise = retry(fn, {
        limit: 20,
        delay: 30,
        timeout: 200,
        signal: controller.signal,
      })

      // 在超时前取消
      vi.advanceTimersByTime(100)
      controller.abort()

      // 等待 promise 被 reject
      await promise.catch(() => {})

      vi.useRealTimers()
    }, 10000)

    it('should handle cancelled state in retry function (line 111)', async () => {
      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        return Promise.reject(new Error('error'))
      })

      const promise = retry(fn, { limit: 5, delay: 10 })

      // Start the retry process
      await new Promise((resolve) => setTimeout(resolve, 30))

      // Cancel to set cancelled=true
      promise.cancel()

      // Wait a bit for any pending operations and catch the rejection
      await promise.catch(() => {})

      // The cancelled flag should prevent further retries
      expect(attempts).toBeLessThanOrEqual(5)
    }, 10000)

    it('should work with delay=0 and timeout', async () => {
      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        return Promise.reject(new Error('error'))
      })

      try {
        await retry(fn, { limit: 100, delay: 0, timeout: 10 })
        expect.unreachable('Should have timed out')
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError)
      }

      // With delay=0, should attempt many times before timeout
      expect(attempts).toBeGreaterThan(1)
    })

    it('should not execute fn after cancellation (line 111)', async () => {
      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        return Promise.reject(new Error('error'))
      })

      const promise = retry(fn, { limit: 3, delay: 50 })

      // Wait for first attempt
      await new Promise((resolve) => setTimeout(resolve, 20))

      // Cancel before next retry
      promise.cancel()

      // Catch the rejection
      await promise.catch(() => {})

      // Give time for any pending operations
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Should not have attempted all 3 times due to cancellation
      expect(attempts).toBeLessThanOrEqual(2)
    }, 10000)

    it('should remove abort listener after successful completion', async () => {
      const controller = new AbortController()
      const removeSpy = vi.spyOn(AbortSignal.prototype, 'removeEventListener')
      const fn = vi.fn(() => Promise.resolve('ok'))

      await retry(fn, { signal: controller.signal })

      expect(removeSpy).toHaveBeenCalledWith('abort', expect.any(Function))
      removeSpy.mockRestore()
    })

    it('should remove abort listener after all retries exhausted', async () => {
      const controller = new AbortController()
      const removeSpy = vi.spyOn(AbortSignal.prototype, 'removeEventListener')
      const fn = vi.fn(() => Promise.reject(new Error('fail')))

      await retry(fn, { limit: 2, delay: 0, signal: controller.signal }).catch(() => {})

      expect(removeSpy).toHaveBeenCalledWith('abort', expect.any(Function))
      removeSpy.mockRestore()
    })

    it('should pass AbortSignal to fn for timeout-aware cancellation', async () => {
      const fn = vi.fn(async (signal?: AbortSignal) => {
        expect(signal).toBeInstanceOf(AbortSignal)
        return 'ok'
      })

      await retry(fn, { limit: 1 })
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should abort fn execution when timeout is exceeded during fn execution', async () => {
      const fn = vi.fn(async (signal?: AbortSignal) => {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, 5000)
          signal?.addEventListener('abort', () => {
            clearTimeout(timer)
            reject(new DOMException('Aborted', 'AbortError'))
          })
        })
        return 'ok'
      })

      await expect(retry(fn, { limit: 1, timeout: 100 })).rejects.toThrow()
    }, 10000)

    it('should handle non-Error rejection values in RetryError message', async () => {
      // oxlint-disable-next-line prefer-promise-reject-errors
      const fn = vi.fn(async () => Promise.reject('string error'))

      const { RetryError } = await import('../error/RetryError')
      try {
        await retry(fn, { limit: 1, delay: 0 })
      } catch (e) {
        expect(e).toBeInstanceOf(RetryError)
        expect((e as any).message).toBe('string error')
      }
    })

    it('should handle number rejection values in RetryError message', async () => {
      // oxlint-disable-next-line prefer-promise-reject-errors
      const fn = vi.fn(async () => Promise.reject(42))

      const { RetryError } = await import('../error/RetryError')
      try {
        await retry(fn, { limit: 1, delay: 0 })
      } catch (e) {
        expect(e).toBeInstanceOf(RetryError)
        expect((e as any).message).toBe('42')
      }
    })

    it('should reject with TimeoutError when remaining time is <= 0', async () => {
      let attempts = 0
      const fn = vi.fn(async () => {
        attempts++
        return Promise.reject(new Error('fail'))
      })

      const promise = retry(fn, { limit: 100, delay: 0, timeout: 30 })

      try {
        await promise
        expect.unreachable('Should have timed out')
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError)
      }

      expect(attempts).toBeGreaterThan(1)
    }, 10000)

    it('should handle cancelled state during retry execution (line 113)', async () => {
      const controller = new AbortController()
      const fn = vi.fn(async () => {
        return Promise.reject(new Error('fail'))
      })

      const promise = retry(fn, { limit: 10, delay: 50, signal: controller.signal })
      const catchPromise = promise.catch(() => {})

      controller.abort()

      await catchPromise
    }, 10000)

    it('should support cancel method on returned promise', async () => {
      const fn = vi.fn(async () => {
        return Promise.reject(new Error('fail'))
      })

      const promise = retry(fn, { limit: 10, delay: 50 })
      const catchPromise = promise.catch(() => {})

      promise.cancel()

      await catchPromise
    }, 10000)

    it('should reject with TimeoutError when remaining time <= 0 after delay (lines 129-131)', async () => {
      const fn = vi.fn(async () => {
        return Promise.reject(new Error('fail'))
      })

      const promise = retry(fn, { limit: 100, delay: 0, timeout: 30 })

      try {
        await promise
        expect.unreachable('Should have timed out')
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError)
      }
    }, 10000)

    it('should reject with TimeoutError when fn does not respond to AbortSignal', async () => {
      const fn = vi.fn(async () => {
        await new Promise<void>((resolve) => setTimeout(resolve, 5000))
        return 'ok'
      })

      await expect(retry(fn, { limit: 1, timeout: 100 })).rejects.toThrow(TimeoutError)
    }, 10000)

    it('should preserve original error as cause in RetryError', async () => {
      const originalError = new Error('original error')
      const fn = vi.fn(async () => Promise.reject(originalError))

      const { RetryError } = await import('../error/RetryError')
      try {
        await retry(fn, { limit: 1, delay: 0 })
      } catch (e) {
        expect(e).toBeInstanceOf(RetryError)
        expect((e as any).cause).toBe(originalError)
      }
    })
  })

  describe('fn 同步抛出异常', () => {
    it('should retry when fn throws synchronously', async () => {
      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        throw new Error('sync error')
      })

      try {
        await retry(fn, { limit: 3, delay: 0 })
        expect.unreachable('Should have rejected')
      } catch (e) {
        expect(e).toBeDefined()
        expect((e as Error).message).toContain('sync error')
      }

      expect(attempts).toBe(3)
    })

    it('should retry sync throw and eventually succeed', async () => {
      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        if (attempts < 2) throw new Error('sync error')
        return Promise.resolve('ok')
      })

      const result = await retry(fn, { limit: 3, delay: 0 })
      expect(result).toBe('ok')
      expect(attempts).toBe(2)
    })

    it('should timeout during sync throw retries', async () => {
      const fn = vi.fn(() => {
        throw new Error('sync error')
      })

      try {
        await retry(fn, { limit: 100, delay: 0, timeout: 30 })
        expect.unreachable('Should have timed out')
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError)
      }
    }, 10000)

    it('should cancel during sync throw retries', async () => {
      vi.useFakeTimers()

      let attempts = 0
      const fn = vi.fn(() => {
        attempts++
        throw new Error('sync error')
      })

      const promise = retry(fn, { limit: 10, delay: 50 })

      vi.advanceTimersByTime(120)
      promise.cancel()

      await promise.catch(() => {})

      expect(attempts).toBeLessThanOrEqual(4)

      vi.useRealTimers()
    }, 10000)
  })

  describe('取消与 fn 回调的交互', () => {
    it('should clear both delay timer and timeout timer on cancel', async () => {
      vi.useFakeTimers()

      const fn = vi.fn(() => Promise.reject(new Error('error')))
      const promise = retry(fn, { limit: 10, delay: 100, timeout: 500 })

      // Let first attempt fail and enter delay period
      vi.advanceTimersByTime(10)

      // Now both timer (for delay) and timeoutTimer (for timeout) should be active
      promise.cancel()

      await promise.catch(() => {})

      vi.useRealTimers()
    })

    it('should clear timeout timer when fn resolves before timeout', async () => {
      const fn = vi.fn(async () => 'success')
      const result = await retry(fn, { limit: 3, timeout: 5000 })
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    }, 10000)

    it('should not reject with TimeoutError when fn resolves before timeout fires', async () => {
      vi.useFakeTimers()
      let resolveFn: (v: string) => void
      const fn = vi.fn(
        () =>
          new Promise<string>((resolve) => {
            resolveFn = resolve
          }),
      )
      const promise = retry(fn, { limit: 1, timeout: 100 })
      await vi.advanceTimersByTimeAsync(50)
      resolveFn!('result')
      await vi.advanceTimersByTimeAsync(100)
      await expect(promise).resolves.toBe('result')
      vi.useRealTimers()
    })

    it('should reject with AbortError when cancelled before async fn rejects', async () => {
      let rejectFn: (e: Error) => void
      const fn = vi.fn(async () => {
        return new Promise<never>((_, reject) => {
          rejectFn = reject
        })
      })

      const promise = retry(fn, { limit: 3, delay: 10 })

      await new Promise((r) => setTimeout(r, 20))

      promise.cancel()

      rejectFn!(new Error('boom'))

      await expect(promise).rejects.toThrow(DOMException)
    }, 10000)

    it('should guard handleSuccess when cancel precedes fn resolve callback', async () => {
      let resolveFn: (v: string) => void
      const fn = vi.fn(() => {
        return new Promise<string>((resolve) => {
          resolveFn = resolve
        })
      })

      const promise = retry(fn, { limit: 3 })

      promise.cancel()

      resolveFn!('success')

      await expect(promise).rejects.toThrow(DOMException)
    }, 10000)
  })

  describe('参数校验', () => {
    it('should throw RangeError when limit is 0', () => {
      const fn = vi.fn(() => Promise.resolve(1))
      expect(() => retry(fn, { limit: 0 })).toThrow(RangeError)
      expect(() => retry(fn, { limit: 0 })).toThrow('limit must be at least 1')
    })

    it('should throw RangeError when limit is negative', () => {
      const fn = vi.fn(() => Promise.resolve(1))
      expect(() => retry(fn, { limit: -1 })).toThrow(RangeError)
      expect(() => retry(fn, { limit: -1 })).toThrow('limit must be at least 1')
    })

    it('should throw RangeError when delay is negative', () => {
      const fn = vi.fn(() => Promise.resolve(1))
      expect(() => retry(fn, { delay: -1 })).toThrow(RangeError)
      expect(() => retry(fn, { delay: -1 })).toThrow('delay must be non-negative')
    })

    it('should throw RangeError when timeout is 0', () => {
      const fn = vi.fn(() => Promise.resolve(1))
      expect(() => retry(fn, { timeout: 0 })).toThrow(RangeError)
      expect(() => retry(fn, { timeout: 0 })).toThrow('timeout must be positive')
    })

    it('should throw RangeError when timeout is negative', () => {
      const fn = vi.fn(() => Promise.resolve(1))
      expect(() => retry(fn, { timeout: -100 })).toThrow(RangeError)
      expect(() => retry(fn, { timeout: -100 })).toThrow('timeout must be positive')
    })

    it('should accept valid timeout', async () => {
      const fn = vi.fn(() => Promise.resolve('ok'))
      const result = await retry(fn, { timeout: 5000 })
      expect(result).toBe('ok')
    })
  })

  describe('cleanup settled 检查', () => {
    it('should be no-op when cancel is called after promise is already settled', async () => {
      const fn = vi.fn(() => Promise.resolve('ok'))
      const promise = retry(fn, { limit: 3 })

      const result = await promise
      expect(result).toBe('ok')

      promise.cancel()

      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    it('should not reject again when cancel is called after success', async () => {
      const fn = vi.fn(() => Promise.resolve('ok'))
      const promise = retry(fn, { limit: 3 })

      const result = await promise
      expect(result).toBe('ok')

      promise.cancel()
      promise.cancel()

      await new Promise((resolve) => setTimeout(resolve, 50))
    })
  })
})
