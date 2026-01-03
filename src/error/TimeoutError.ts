/**
 * An error class representing an timeout operation.
 * @category Error
 * @augments Error
 */
export class TimeoutError extends Error {
  constructor(message = 'The operation was timed out') {
    super(message)
    this.name = 'TimeoutError'
  }
}
