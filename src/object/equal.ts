import { T_ARRAY, T_DATE, T_MAP, T_OBJECT, T_REGEXP, T_SET } from '../_internal/tags'
import { isNumber, isString, typeOf } from '../predicate'
import { hasOwn } from './has-own'
import { objectKeys } from './keys'

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
 * @remarks
 * This function uses an internal `Map` stack to handle circular references safely, preventing infinite recursion.
 * `NaN` is considered equal to `NaN` (via `Object.is`), which differs from the default `===` behavior.
 *
 * 此函数使用内部的 `Map` 栈来安全处理循环引用，防止无限递归。
 * `NaN` 被认为等于 `NaN`（通过 `Object.is` 判断），这与默认的 `===` 行为不同。
 * When comparing RegExp objects, only `source` and `flags` are compared; the `lastIndex` property is ignored.
 * If you need to compare `lastIndex`, reset it manually before calling this function.
 *
 * 比较正则表达式时，仅比较 `source` 和 `flags`，`lastIndex` 属性会被忽略。
 * 如需比较 `lastIndex`，请在调用此函数前手动重置。
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
  return deepEqualWithStack(v1, v2, new Map())
}

function deepEqualWithStack(v1: any, v2: any, stack: Map<any, any>): boolean {
  if (Object.is(v1, v2)) return true
  if (v1 == null || v2 == null) return false

  const vt1 = typeof v1
  const vt2 = typeof v2
  if (vt1 !== vt2) return false

  if (vt1 !== T_OBJECT) return false

  if (stack.has(v1)) {
    return stack.get(v1) === v2
  }
  stack.set(v1, v2)

  const t1 = typeOf(v1)
  if (t1 !== typeOf(v2)) return false

  if (t1 === T_ARRAY) {
    const len = v1.length
    if (len !== v2.length) return false
    for (let i = 0; i < len; i++) {
      if (!deepEqualWithStack(v1[i], v2[i], stack)) return false
    }
    return true
  }

  if (t1 === T_OBJECT) {
    const keys = objectKeys(v1)
    if (keys.length !== objectKeys(v2).length) return false
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!
      if (!hasOwn(v2, key) || !deepEqualWithStack(v1[key], v2[key], stack)) return false
    }
    return true
  }

  if (t1 === T_DATE) {
    return v1.getTime() === v2.getTime()
  }

  if (t1 === T_SET) {
    if (v1.size !== v2.size) return false
    const v2Items = [...v2]
    for (const item of v1) {
      if (!v2Items.some((v2Item) => deepEqualWithStack(item, v2Item, new Map(stack)))) return false
    }
    return true
  }

  if (t1 === T_MAP) {
    if (v1.size !== v2.size) return false
    const primitiveKeyMap = new Map()
    const complexEntries: [any, any][] = []
    for (const [v2Key, v2Value] of v2) {
      if (isString(v2Key) || isNumber(v2Key)) {
        primitiveKeyMap.set(v2Key, v2Value)
      } else {
        complexEntries.push([v2Key, v2Value])
      }
    }
    for (const [key, value] of v1) {
      if (isString(key) || isNumber(key)) {
        if (!primitiveKeyMap.has(key)) return false
        if (!deepEqualWithStack(value, primitiveKeyMap.get(key), new Map(stack))) return false
      } else {
        let found = false
        for (const [v2Key, v2Value] of complexEntries) {
          if (
            deepEqualWithStack(key, v2Key, new Map(stack)) &&
            deepEqualWithStack(value, v2Value, new Map(stack))
          ) {
            found = true
            break
          }
        }
        if (!found) return false
      }
    }
    return true
  }

  if (t1 === T_REGEXP) return v1.source === v2.source && v1.flags === v2.flags

  return false
}
