/**
 * helpers
 *
 * @module Assert
 */

/**
 * Asserts that a condition is true
 *
 * @param condition the condition to assert
 * @param message the message to display if the condition is false
 *
 * @category Common
 */
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}
