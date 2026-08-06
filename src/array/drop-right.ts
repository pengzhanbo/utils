/**
 * Drops the last n elements of an array.
 *
 * Returns a new array containing all elements of the input array except the
 * last `n`. A non-finite `n` (`NaN` or `Infinity`) is treated as `0`, floats
 * are truncated, negative values are clamped to `0`, and values greater than
 * the array length are clamped to the length.
 *
 * 从数组末尾丢弃最后 n 个元素。
 *
 * 返回一个新数组，包含输入数组中除最后 `n` 个之外的所有元素。非有限值 `n`（`NaN` 或 `Infinity`）按 `0` 处理，浮点数会被截断，负数按 `0` 处理，超过数组长度的值按数组长度处理。
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param arr - The array to drop from. 要丢弃元素的数组
 * @param num - The number of elements to drop. Defaults to 1. 要丢弃的元素个数，默认为 1
 * @returns A new array without the last n elements. 去除最后 n 个元素后的新数组
 *
 * @remarks
 * O(n) time complexity - `Array.prototype.slice`
 *
 * O(n) 时间复杂度 - 使用 `Array.prototype.slice`
 *
 * @example
 * ```ts
 * dropRight([1, 2, 3], 2)
 * // => [1]
 * ```
 */
export function dropRight<T>(arr: readonly T[], num = 1): T[] {
  const count = Number.isFinite(num) ? Math.max(Math.trunc(num), 0) : 0
  const k = Math.min(count, arr.length)
  return arr.slice(0, arr.length - k)
}
