import { expect, it } from 'vitest'
import { range } from './array'
import { random } from './math'
import { promiseParallel, sleep } from './promise'

it('promise parallel', async () => {
  await expect(
    promiseParallel(
      new Array(5).fill(0).map((_, i) => async () => {
        // console.log(i)
        await sleep(range(100, 1000, 100)[random(9)])
        return i
      }),
      2,
    ),
  ).resolves.toEqual([0, 1, 2, 3, 4])

  await expect(
    promiseParallel(
      [
        async () => {
          await sleep(100)
          return 1
        },
        () => Promise.reject(new Error('error')),
        async () => {
          await sleep(100)
          return 3
        },
      ],
      1,
    ),
  ).rejects.toThrowError('error')
})
