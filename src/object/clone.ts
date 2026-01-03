/**
 * clone data
 *
 * 克隆数据
 *
 * @module Clone
 */

import { deepCloneImpl } from '../_internal/deepCloneImpl'
import { isArray, isPlainObject, isPrimitive, isTypedArray } from '../is'
import { hasOwn } from './has-own'

/**
 * simple clone, use JSON.parse and JSON.stringify
 *
 * 简单的克隆,使用 JSON.parse 和 JSON.stringify
 *
 * @category Clone
 */
export function simpleClone<T = any>(source: T): T {
  return JSON.parse(JSON.stringify(source))
}

/**
 * shallow clone, only clone the first level
 *
 * 浅克隆,只克隆第一层
 *
 * @category Clone
 */
export function shallowClone<T = any>(source: T): T {
  if (isPrimitive(source))
    return source

  if (
    isArray(source)
    || isTypedArray(source)
    || source instanceof ArrayBuffer
    || (typeof SharedArrayBuffer !== 'undefined' && source instanceof SharedArrayBuffer)
  ) {
    return source.slice(0) as T
  }

  const prototype = Object.getPrototypeOf(source)
  const Constructor = prototype.constructor

  if (source instanceof Date || source instanceof Map || source instanceof Set) {
    return new Constructor(source)
  }

  if (source instanceof RegExp) {
    const newRegExp = new Constructor(source)
    newRegExp.lastIndex = source.lastIndex

    return newRegExp
  }

  if (source instanceof DataView) {
    return new Constructor(source.buffer.slice(0))
  }

  if (source instanceof Error) {
    const newError = new Constructor(source.message, {
      cause: source.cause,
    })

    if (hasOwn(source, 'name'))
      newError.name = source.name

    newError.stack = source.stack

    return newError
  }

  if (typeof File !== 'undefined' && source instanceof File) {
    const newFile = new Constructor([source], source.name, { type: source.type, lastModified: source.lastModified })
    return newFile
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
 */
export function deepClone<T = any>(source: T): T {
  return deepCloneImpl(source, source, new Map())
}
