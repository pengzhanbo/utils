import { T_ARRAY, T_DATE, T_MAP, T_OBJECT, T_REGEXP, T_SET } from '../_internal/tags'
import { typeOf } from '../predicate'

/**
 * Deep equality two values, support array / object / date / set / map / regexp
 *
 * 深度比较两个值是否相等，支持数组、对象、日期、集合、映射、正则表达式等类型值
 *
 * @category Object
 *
 * @param v1 - The first value to compare. 第一个要比较的值
 * @param v2 - The second value to compare. 第二个要比较的值
 * @returns True if the values are deeply equal, false otherwise. 如果值深度相等则返回true，否则返回false
 *
 * @example
 * ```ts
 * deepEqual([1, 2, 3], [1, 2, 3]) // true
 * deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }) // true
 * deepEqual(new Date(), new Date()) // true
 * deepEqual(new Set([1, 2, 3]), new Set([1, 2, 3])) // true
 * deepEqual(new Map([['a', 1], ['b', 2]]), new Map([['a', 1], ['b', 2]])) // true
 * deepEqual(new RegExp('a'), new RegExp('a')) // true
 * deepEqual('hello', 'hello') // true
 * deepEqual('hello', 'world') // false
 * deepEqual(null, null) // true
 * deepEqual(undefined, undefined) // true
 * deepEqual(NaN, NaN) // true
 * ```
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

  if (type1 === T_DATE) {
    return v1.getTime() === v2.getTime()
  }

  if (type1 === T_SET) {
    if (v1.size !== v2.size) return false
    return deepEqual([...v1], [...v2])
  }

  if (type1 === T_MAP) {
    if (v1.size !== v2.size) return false
    return (v1 as Map<unknown, unknown>)
      .entries()
      .every(([key, value]) => deepEqual(value, v2.get(key)))
  }

  if (type1 === T_REGEXP) {
    return v1.source === v2.source && v1.flags === v2.flags
  }
  return Object.is(v1, v2)
}
