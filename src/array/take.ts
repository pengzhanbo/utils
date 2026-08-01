/**
 * Takes the first n elements of an array.
 *
 * Returns a new array containing the first `n` elements of the input array.
 * A non-finite `n` (`NaN` or `Infinity`) is treated as `0`, floats are
 * truncated, negative values are clamped to `0`, and values greater than the
 * array length are clamped to the length.
 *
 * 从数组开头截取前 n 个元素。
 *
 * 返回一个新数组，包含输入数组的前 `n` 个元素。非有限值 `n`（`NaN` 或 `Infinity`）按 `0` 处理，浮点数会被截断，负数按 `0` 处理，超过数组长度的值按数组长度处理。
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param arr - The array to take from. 要截取的数组
 * @param n - The number of elements to take. Defaults to 1. 要截取的元素个数，默认为 1
 * @returns A new array with the first n elements. 包含前 n 个元素的新数组
 *
 * @remarks
 * O(n) time complexity - `Array.prototype.slice`
 *
 * O(n) 时间复杂度 - 使用 `Array.prototype.slice`
 *
 * @example
 * ```ts
 * take([1, 2, 3, 4], 2)
 * // => [1, 2]
 * ```
 */
export function take<T>(arr: readonly T[], n = 1): T[] {
  const count = Number.isFinite(n) ? Math.max(Math.trunc(n), 0) : 0
  const k = Math.min(count, arr.length)
  return arr.slice(0, k)
}
