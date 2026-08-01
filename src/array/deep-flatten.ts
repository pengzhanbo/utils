/**
 * Flattens an array to an arbitrary depth.
 *
 * Returns a new array with all nested arrays recursively flattened into a
 * single-level array. Holes in sparse arrays are treated as `undefined`.
 * The input array is not mutated.
 *
 * 将数组任意深度地扁平化。
 *
 * 返回一个新数组，所有嵌套数组都会被递归展开为单层数组。稀疏数组中的空洞按 `undefined` 处理。
 * 不会修改输入数组。
 *
 * @category Array
 *
 * @typeParam T - The type of the non-array elements in the array / 数组中非数组元素的类型
 * @param arr - The array to flatten. 要扁平化的数组
 * @returns A new array flattened to a single level. 扁平化为单层后的新数组
 *
 * @remarks
 * `Array.prototype.flat()` only covers one level by default; this function
 * flattens to any depth. O(n) time complexity where n is the total number of
 * elements at all levels.
 *
 * `Array.prototype.flat()` 默认只扁平化一层；此函数可扁平化任意深度。
 * 时间复杂度 O(n)，n 为所有层级元素总数。
 *
 * @example
 * ```ts
 * deepFlatten([1, [2, [3, [4]]]])
 * // => [1, 2, 3, 4]
 * ```
 *
 * @example
 * ```ts
 * deepFlatten(['a', [1, [true]]])
 * // => ['a', 1, true]
 * ```
 */
export function deepFlatten<T>(arr: readonly (T | readonly any[])[]): T[] {
  const result: T[] = []

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i]!
    if (Array.isArray(value)) {
      result.push(...deepFlatten(value))
    } else {
      // Array.isArray's guard cannot exclude `readonly any[]` from the union, cast is safe here
      result.push(value as T)
    }
  }

  return result
}
