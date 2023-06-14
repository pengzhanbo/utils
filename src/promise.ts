import type { Fn } from './types'

export async function sleep(ms: number, callback?: Fn<any>) {
  return new Promise<void>((resolve) =>
    setTimeout(async () => {
      await callback?.()
      resolve()
    }, ms),
  )
}
