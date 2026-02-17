/**
 * Random number
 *
 * 返回一个介于 0 和 max 之间的随机数
 *
 * @category Math
 *
 * @param max - The maximum number. 最大值
 * @param float - (optional) If `true`, returns a floating-point number. 是否返回浮点数
 * @returns A random number. 一个随机数
 *
 * @example
 * ```ts
 * random(5) // => an integer between 0 and 5
 * random(5, true) // => a floating-point number between 0 and 5
 * ```
 */
export function random(max: number, float?: boolean): number
/**
 * Random number between min and max
 *
 * 返回一个介于 min 和 max 之间的随机数
 *
 * @category Math
 *
 * @param min - The minimum number. 最小值
 * @param max - The maximum number. 最大值
 * @param float - (optional) If `true`, returns a floating-point number. 是否返回浮点数
 * @returns A random number. 一个随机数
 *
 * @example
 * ```ts
 * random(1, 5) // => an integer between 1 and 5
 * random(1, 5, true) // => a floating-point number between 1 and 5
 * ```
 */
export function random(min: number, max: number, float?: boolean): number
/**
 * Random number between min and max
 *
 * 返回一个介于 min 和 max 之间的随机数
 *
 * @param args
 * @returns a random number / 返回一个随机数
 */
export function random(...args: any[]): number {
  let min, max, float
  if (args.length === 1) {
    min = 0
    max = args[0]
    float = false
  } else {
    if (typeof args[1] === 'number') {
      min = args[0]
      max = args[1]
      float = !!args[2]
    } else {
      min = 0
      max = args[0]
      float = !!args[1]
    }
  }
  const num = Math.random() * (max - min) + min
  return float ? num : Math.floor(num)
}
