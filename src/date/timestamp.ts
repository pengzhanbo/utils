/**
 * Get current timestamp
 *
 * 获取当前时间戳
 *
 * @category Date
 *
 * @returns The current timestamp in milliseconds. 当前时间戳（毫秒）
 */
export function timestamp(): number {
  return +Date.now()
}
