/**
 * Clamp a number between min and max
 * @category Math
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(n, min))
}

/**
 * Check if a number is in range
 * @category Math
 */
export function inRange(n: number, max: number): boolean
export function inRange(n: number, min: number, max: number): boolean
export function inRange(n: number, min: number, max?: number): boolean {
  if (max === undefined) {
    max = min
    min = 0
  }
  return n >= Math.min(min, max) && n <= Math.max(min, max)
}

/**
 * Random number
 * @category Math
 * @example
 * ```ts
 * random(5) // => an integer between 0 and 5
 * random(1, 5) // => an integer between 1 and 5
 * random(1, 5, true) // => a floating-point number between 1 and 5
 * ```
 */
export function random(max: number, float?: boolean): number
export function random(min: number, max: number, float?: boolean): number
export function random(...args: any[]): number {
  let min, max, float
  if (args.length === 1) {
    min = 0
    max = args[0]
    float = false
  }
  else {
    if (typeof args[1] === 'number') {
      min = args[0]
      max = args[1]
      float = !!args[2]
    }
    else {
      min = 0
      max = args[0]
      float = !!args[1]
    }
  }
  const num = Math.random() * (max - min) + min
  return float ? num : Math.floor(num)
}
