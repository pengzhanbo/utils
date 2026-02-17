/**
 * helpers
 *
 * @module Assert
 */

/**
 * Asserts that a condition is true
 *
 * 断言条件为真
 *
 * @param condition - The condition to assert. 要断言的条件
 * @param message - The message to display if the condition is false. 如果条件为假时显示的消息
 * @throws {Error} If the condition is false. 如果条件为假
 *
 * @category Common
 */
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}
