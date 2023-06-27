import { getTypeName } from './common.js'

/**
 * Deep equality two values,
 */
export function deepEqual(v1: any, v2: any): boolean {
  const type1 = getTypeName(v1)
  const type2 = getTypeName(v2)
  if (type1 !== type2) return false
  if (type1 === 'array') {
    if (v1.length !== v2.length) return false
    return v1.every((item: any, index: number) => deepEqual(item, v2[index]))
  }
  if (type1 === 'object') {
    const keys1 = Object.keys(v1)
    if (keys1.length !== Object.keys(v2).length) return false
    return keys1.every((key: string) => deepEqual(v1[key], v2[key]))
  }
  return Object.is(v1, v2)
}
