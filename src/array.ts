import { isArray } from './is'
import type { Arrayable, Nullable } from './types'

/**
 * Convert Arrayable<T> to Array<T>
 * @category Array
 */
export function toArray<T>(v: Nullable<Arrayable<T>>): Array<T> {
  if (v === null || v === undefined) return []
  if (isArray(v)) return v
  return [v]
}

/**
 * Unique array
 * @category Array
 */
export function uniq<T>(v: T[]): T[] {
  return Array.from(new Set(v))
}

/**
 * Unique array by a custom equality function
 */
export function uniqueBy<T>(
  array: T[],
  equalFn: (a: any, b: any) => boolean,
): T[] {
  return array.reduce((acc: T[], cur: any) => {
    const index = acc.findIndex((item: any) => equalFn(cur, item))
    if (index === -1) acc.push(cur)
    return acc
  }, [])
}

/**
 * Remove value from array
 * @category Array
 */
export function remove<T>(array: T[], value: T) {
  if (!isArray(array)) return false
  const index = array.indexOf(value)
  if (index !== -1) {
    array.splice(index, 1)
    return true
  }
  return false
}

/**
 * Generate a range array of numbers. The `stop` is exclusive.
 * @category Array
 */
export function range(stop: number): number[]
export function range(start: number, stop: number, step?: number): number[]
export function range(...args: any): number[] {
  let start, stop, step
  if (args.length === 1) {
    start = 0
    stop = args[0]
    step = 1
  } else {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;[start, stop, step = 1] = args
  }
  const arr: number[] = []
  let current = start
  while (current < stop) {
    arr.push(current)
    current += step || 1
  }

  return arr
}

/**
 * Move item in an array
 * @category Array
 */
export function move<T>(arr: T[], from: number, to: number) {
  arr.splice(to, 0, arr.splice(from, 1)[0])
  return arr
}

/**
 * Shuffle array
 * @category Array
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
