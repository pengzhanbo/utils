/**
 * Generate a range array of numbers starting from `0`. The `stop` is exclusive.
 *
 * 从 `0` 开始生成一个数字范围的数组, `stop` 是不包含的。
 *
 * @category Array
 *
 * @param stop - the end of the range. 范围结束数字。
 *
 * @example
 * ```ts
 * range(5) // => [0, 1, 2, 3, 4]
 * ```
 */
export function range(stop: number): number[]
/**
 * Generate a range array of numbers. The `stop` is exclusive.
 *
 * 生成一个数字范围的数组, `stop` 是不包含的。
 *
 * @category Array
 *
 * @param start - the start of the range. 范围开始数字
 * @param stop - the end of the range. 范围结束数字
 * @param step - the step of the range. 步进
 *
 * @example
 * ```ts
 * range(5, 10) // => [5, 6, 7, 8, 9]
 * range(5, 10, 2) // => [5, 7, 9]
 * ```
 */
export function range(start: number, stop: number, step?: number): number[]
/**
 * Generate a range array of numbers. The `stop` is exclusive.
 *
 * 生成一个数字范围的数组, `stop` 是不包含的。
 *
 * @param args
 * @returns - a range array of numbers / 返回一个数字范围的数组
 */
export function range(...args: any): number[] {
  let start, stop, step
  if (args.length === 1) {
    start = 0
    stop = args[0]
    step = 1
  }
  else {
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
