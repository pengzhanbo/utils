/**
 * clone data
 *
 * 克隆数据
 *
 * @module Clone
 * @typeParam T - The type of elements in the array / 数组元素的类型
 */

import { deepCloneImpl } from '../_internal/deepCloneImpl'
import { T_DATAVIEW, T_DATE, T_MAP, T_REGEXP, T_SET, T_UNDEFINED } from '../_internal/tags'
import { isArray, isError, isPlainObject, isPrimitive, isTypedArray, typeOf } from '../predicate'
import { hasOwn } from './has-own'

/**
 * simple clone, use JSON.parse and JSON.stringify
 *
 * 简单的克隆,使用 JSON.parse 和 JSON.stringify
 *
 * @category Clone
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param source - The source data to clone. 要克隆的源数据
 * @returns The cloned data. 克隆后的数据
 *
 * @remarks
 * This function uses `JSON.parse(JSON.stringify())` which has the following limitations:
 * - `undefined` values, functions, and Symbol keys/values are silently dropped
 * - `Date` objects are converted to ISO strings (not Date instances)
 * - `RegExp`, `Map`, `Set`, `ArrayBuffer`, `TypedArray` are not properly cloned
 * - Circular references will throw a `TypeError`
 * - `NaN` and `Infinity` are converted to `null`
 *
 * For full deep cloning support, use {@link deepClone} instead.
 *
 * 此函数使用 `JSON.parse(JSON.stringify())`，存在以下限制：
 * - `undefined` 值、函数和 Symbol 键/值会被静默丢弃
 * - `Date` 对象会转换为 ISO 字符串（而非 Date 实例）
 * - `RegExp`、`Map`、`Set`、`ArrayBuffer`、`TypedArray` 无法正确克隆
 * - 循环引用会抛出 `TypeError`
 * - `NaN` 和 `Infinity` 会被转换为 `null`
 *
 * 如需完整的深克隆支持，请使用 {@link deepClone}。
 *
 * @see {@link deepClone} and {@link shallowClone} — for other clone strategies
 * @see {@link deepClone} 和 {@link shallowClone} — 其他克隆策略
 */
export function simpleClone<T = any>(source: T): T {
  if (isPrimitive(source)) return source
  return JSON.parse(JSON.stringify(source))
}

/**
 * shallow clone, only clone the first level
 *
 * 浅克隆,只克隆第一层
 *
 * @category Clone
 *
 * @param source - The source data to clone. 要克隆的源数据
 * @returns The cloned data. 克隆后的数据
 * @remarks
 * This function preserves the prototype chain and handles Date, Map, Set, RegExp, Error, and File objects specifically by constructing new instances from the originals. Arrays, TypedArrays, ArrayBuffer, and SharedArrayBuffer are cloned via `.slice()`. Plain objects are cloned via `Object.assign` with the prototype preserved.
 *
 * 此函数会保留原型链，并针对 Date、Map、Set、RegExp、Error 和 File 对象进行特殊处理，通过构造新实例来完成克隆。数组、TypedArrays、ArrayBuffer 和 SharedArrayBuffer 通过 `.slice()` 克隆。普通对象通过 `Object.assign` 克隆并保留原型。
 */
export function shallowClone<T = any>(source: T): T {
  if (isPrimitive(source)) return source

  if (
    isArray(source) ||
    isTypedArray(source) ||
    source instanceof ArrayBuffer ||
    // oxlint-disable-next-line valid-typeof
    (typeof SharedArrayBuffer !== T_UNDEFINED && source instanceof SharedArrayBuffer)
  ) {
    return source.slice(0) as T
  }

  const prototype = Object.getPrototypeOf(source)
  const Constructor = prototype?.constructor

  if (Constructor && Constructor !== Object) {
    const type = typeOf(source)
    if (type === T_DATE || type === T_MAP || type === T_SET) {
      return new Constructor(source)
    }

    if (type === T_REGEXP) {
      const newRegExp = new Constructor(source)
      newRegExp.lastIndex = (source as RegExp).lastIndex
      return newRegExp
    }

    if (type === T_DATAVIEW) {
      return new Constructor(
        (source as DataView).buffer.slice(0),
        (source as DataView).byteOffset,
        (source as DataView).byteLength,
      )
    }

    if (isError(source)) {
      const newError = new Constructor(source.message, {
        cause: source.cause,
      })

      if (hasOwn(source, 'name')) newError.name = source.name

      newError.stack = source.stack

      return newError
    }

    /* istanbul ignore if -- @preserve */
    // oxlint-disable-next-line valid-typeof
    if (typeof File !== T_UNDEFINED && source instanceof File) {
      const newFile = new Constructor([source], source.name, {
        type: source.type,
        lastModified: source.lastModified,
      })
      return newFile
    }
  }

  /* istanbul ignore if -- @preserve */
  if (isPlainObject(source)) {
    return Object.assign(Object.create(prototype), source)
  }

  /* istanbul ignore next -- @preserve */
  return source
}

/**
 * Deep Clone.
 *
 * 深度克隆
 *
 * @category Clone
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param source - The source data to clone. 要克隆的源数据
 * @returns The deeply cloned data. 深度克隆后的数据
 *
 * @remarks
 * This function uses an internal `Map` to handle circular references safely, preventing infinite recursion during deep cloning.
 *
 * 此函数使用内部的 `Map` 来安全处理循环引用，防止深度克隆过程中的无限递归。
 */
export function deepClone<T = any>(source: T): T {
  return deepCloneImpl(source, new Map())
}
