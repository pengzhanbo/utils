import { remove } from '../array/remove'

/**
 * Create a promise task execution lock
 *
 * 创建一个 promise 任务执行锁
 *
 * @category Promise
 *
 * @example
 * ```
 * const lock = createPromiseLock()
 *
 * lock.run(async () => {
 *   await doSomething()
 * })
 *
 * // in anther context:
 * await lock.wait() // it will wait all tasking finished
 * ```
 */
export function createPromiseLock(): {
  run: <T = void>(fn: () => Promise<T>) => Promise<T>
  wait: () => Promise<void>
  isWaiting: () => boolean
  clear: () => void
} {
  const locks: Promise<any>[] = []

  return {
    async run<T = void>(fn: () => Promise<T>): Promise<T> {
      const p = fn()
      locks.push(p)
      try {
        return await p
      } finally {
        remove(locks, p)
      }
    },
    async wait(): Promise<void> {
      await Promise.allSettled(locks)
    },
    isWaiting() {
      return Boolean(locks.length)
    },
    clear() {
      locks.length = 0
    },
  }
}
