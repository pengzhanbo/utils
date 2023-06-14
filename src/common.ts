export function toString(s: unknown): string {
  return Object.prototype.toString.call(s)
}

export function getTypeName(s: unknown) {
  return s === null
    ? 'null'
    : typeof s === 'object' || typeof s === 'function'
    ? toString(s).slice(8, -1).toLowerCase()
    : typeof s
}
