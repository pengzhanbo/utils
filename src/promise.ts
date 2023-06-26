import type { Fn } from './types'

export async function sleep(ms: number, callback?: Fn<any>) {
  return new Promise<void>((resolve) =>
    setTimeout(async () => {
      await callback?.()
      resolve()
    }, ms),
  )
}

/**
 * Executes an array of promises in parallel with a given concurrency. The function
 * returns a Promise that resolves with an array containing the resolved values of
 * each promise.
 *
 * @category Promise
 */
export function promiseParallel(
  promises: PromiseLike<any>[],
  concurrency = Infinity,
) {
  promises = Array.from(promises)
  let current = 0
  const result: any[] = []
  let resolvedCount = 0
  const len = promises.length
  return new Promise((resolve, reject) => {
    function next() {
      const index = current++
      Promise.resolve(promises[index])
        .then((res) => {
          result[index] = res
          if (++resolvedCount === len) {
            resolve(result)
          }
          if (current < len) {
            next()
          }
        })
        .catch((e) => reject(e))
    }
    for (let i = 0; i < concurrency && i < len; i++) {
      next()
    }
  })
}
