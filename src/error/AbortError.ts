/**
 * An error class representing an aborted operation.
 * @category Error
 * @augments Error
 */
export class AbortError extends Error {
  constructor(message = 'The operation was aborted') {
    super(message)
    this.name = 'AbortError'
  }
}
