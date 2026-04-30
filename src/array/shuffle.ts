/**
 * Array shuffling, randomly rearranging the order of elements in an array
 *
 * 数组洗牌，随机打乱数组中的顺序
 *
 * @category Array
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param array - The array to shuffle / 要洗牌的数组
 * @returns The shuffled array (same reference as input) / 洗牌后的数组（与输入为同一引用）
 *
 * @remarks
 * This function **mutates** the original array and returns it.
 * If you need to preserve the original array, pass a copy: `shuffle([...arr])`.
 *
 * 此函数会**修改**原数组并返回它。
 * 如果需要保留原数组，请传入副本：`shuffle([...arr])`。
 *
 * @example
 * ```ts
 * shuffle([1, 2, 3]) // => [1, 3, 2]
 * ```
 */
export function shuffle<T>(array: T[]): T[] {
  let i = array.length - 1
  while (i > 0) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = array[j]!
    array[j] = array[i]!
    array[i] = tmp
    i--
  }
  return array
}
