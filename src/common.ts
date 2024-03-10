/**
 * @category Common
 */
export function toString(s: unknown): string {
  return Object.prototype.toString.call(s)
}

/**
 * Get type name of a value
 * @category Common
 * @example
 * ```ts
 * getTypeName(null) // => 'null'
 * getTypeName(undefined) // => 'undefined'
 * getTypeName({}) // => 'object'
 * ```
 */
export function getTypeName(s: unknown): string {
  return s === null
    ? 'null'
    : typeof s === 'object' || typeof s === 'function'
      ? toString(s).slice(8, -1).toLowerCase()
      : typeof s
}
