/**
 * Equal
 *
 * @module Equal
 */

import { T_ARRAY, T_OBJECT } from '../_internal/tags'
import { typeOf } from '../is'

/**
 * Deep equality two values, support array and object
 *
 * @category Equal
 */
export function deepEqual(v1: any, v2: any): boolean {
  const type1 = typeOf(v1)
  const type2 = typeOf(v2)
  if (type1 !== type2) return false
  if (type1 === T_ARRAY) {
    if (v1.length !== v2.length) return false

    return v1.every((item: any, index: number) => deepEqual(item, v2[index]))
  }
  if (type1 === T_OBJECT) {
    const keys1 = Object.keys(v1)
    if (keys1.length !== Object.keys(v2).length) return false

    return keys1.every((key: string) => deepEqual(v1[key], v2[key]))
  }
  return Object.is(v1, v2)
}
