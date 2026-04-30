import { isUndefined } from '../predicate'

/**
 * Precisely add two floating-point numbers
 *
 * 精确相加两个数
 *
 * @category Math
 *
 * @param a - The first number. 第一个数字
 * @param b - The second number. 第二个数字
 * @returns The sum of the two numbers. 两个数字的和
 *
 * @remarks
 * The current implementation only considers predictable scenarios and cannot guarantee precise calculation results under all circumstances;
 * For calculation scenarios involving large numbers, finance, science, etc., it is recommended to use open-source libraries such as decimal.js to handle mathematical operations.
 *
 * 当前实现仅考虑可预期的场景，无法保证在所有情况下都能精确计算结果；
 * 涉及到大数、金融、科学等计算场景，建议使用 decimal.js 等开源库来处理数学运算
 *
 * @example
 * ```ts
 * decimalAdd(0.1, 0.2) // => 0.3
 * decimalAdd(1.5, 2.3) // => 3.8
 * decimalAdd(10.001, 20.002) // => 30.003
 * ```
 */
export function decimalAdd(a: number, b: number): number {
  const maxDecimals = Math.max(getDecimalPlaces(a), getDecimalPlaces(b))
  const multiplier = 10 ** maxDecimals
  return (toInteger(a, multiplier) + toInteger(b, multiplier)) / multiplier
}

/**
 * Precisely subtract two floating-point numbers
 *
 * 精确相减两个数
 *
 * @category Math
 *
 * @param a - The first number. 第一个数字
 * @param b - The second number. 第二个数字
 * @returns The difference of the two numbers. 两个数字的差
 *
 * @remarks
 * The current implementation only considers predictable scenarios and cannot guarantee precise calculation results under all circumstances;
 * For calculation scenarios involving large numbers, finance, science, etc., it is recommended to use open-source libraries such as decimal.js to handle mathematical operations.
 *
 * 当前实现仅考虑可预期的场景，无法保证在所有情况下都能精确计算结果；
 * 涉及到大数、金融、科学等计算场景，建议使用 decimal.js 等开源库来处理数学运算
 *
 * @example
 * ```ts
 * decimalSubtract(0.1, 0.2) // => -0.1
 * decimalSubtract(1.5, 2.3) // => -0.8
 * decimalSubtract(10.001, 20.002) // => -10.001
 * ```
 */
export function decimalSubtract(a: number, b: number): number {
  return decimalAdd(a, -b)
}

/**
 * Precisely multiply two floating-point numbers
 *
 * 精确相乘两个数
 *
 * @category Math
 *
 * @param a - The first number. 第一个数字
 * @param b - The second number. 第二个数字
 * @returns The product of the two numbers. 两个数字的积
 *
 * @remarks
 * The current implementation only considers predictable scenarios and cannot guarantee precise calculation results under all circumstances;
 * For calculation scenarios involving large numbers, finance, science, etc., it is recommended to use open-source libraries such as decimal.js to handle mathematical operations.
 *
 * 当前实现仅考虑可预期的场景，无法保证在所有情况下都能精确计算结果；
 * 涉及到大数、金融、科学等计算场景，建议使用 decimal.js 等开源库来处理数学运算
 *
 * @example
 * ```ts
 * decimalMultiply(0.1, 0.2) // => 0.02
 * decimalMultiply(1.5, 2.3) // => 3.45
 * decimalMultiply(10.001, 20) // => 200.02
 * ```
 */
export function decimalMultiply(a: number, b: number): number {
  const aPlaces = getDecimalPlaces(a)
  const bPlaces = getDecimalPlaces(b)
  const totalDecimals = aPlaces + bPlaces
  return (toInteger(a, 10 ** aPlaces) * toInteger(b, 10 ** bPlaces)) / 10 ** totalDecimals
}

/**
 * Precisely divide two floating-point numbers
 *
 * 精确相除两个数
 *
 * @category Math
 *
 * @param a - The first number. 第一个数字
 * @param b - The second number. 第二个数字
 * @param precision - The precision of the result. 结果的精度
 * @returns The quotient of the two numbers. 两个数字的商
 *
 * @throws {Error} When `b` is zero (division by zero is not allowed). 当 `b` 为零时抛出（不允许除零）。
 *
 * @remarks
 * The current implementation only considers predictable scenarios and cannot guarantee precise calculation results under all circumstances;
 * For calculation scenarios involving large numbers, finance, science, etc., it is recommended to use open-source libraries such as decimal.js to handle mathematical operations.
 *
 * 当前实现仅考虑可预期的场景，无法保证在所有情况下都能精确计算结果；
 * 涉及到大数、金融、科学等计算场景，建议使用 decimal.js 等开源库来处理数学运算
 *
 * @example
 * ```ts
 * decimalDivide(0.1, 0.2) // => 0.5
 * decimalDivide(1.5, 2.3) // => 0.6521739130434783
 * decimalDivide(10.001, 20) // => 0.50005
 * ```
 */
export function decimalDivide(a: number, b: number, precision?: number): number {
  if (b === 0) {
    throw new Error('Division by zero is not allowed')
  }
  const maxDecimals = Math.max(getDecimalPlaces(a), getDecimalPlaces(b))
  const multiplier = 10 ** maxDecimals
  const result = toInteger(a, multiplier) / toInteger(b, multiplier)
  if (!isUndefined(precision)) {
    if (!Number.isInteger(precision) || precision < 0) {
      throw new TypeError('precision must be a non-negative integer')
    }
    const factor = 10 ** precision
    return Math.round(result * factor) / factor
  }
  return result
}

/** @internal */
function getDecimalPlaces(num: number): number {
  const str = String(num)
  const match = str.match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)!
  const decimals = (match[1] || '').length
  const exponent = Number.parseInt(match[2] || '0', 10)
  return Math.max(0, decimals - exponent)
}

/** @internal */
function toInteger(num: number, multiplier: number): number {
  const product = num * multiplier
  if (!Number.isFinite(product) || Math.abs(product) > Number.MAX_SAFE_INTEGER) {
    return Number.NaN
  }
  return Math.round(product)
}
