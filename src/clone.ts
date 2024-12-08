/**
 * clone data
 *
 * 克隆数据
 *
 * @module Clone
 */

import { isArray, isPlainObject, isPrimitive, isTypedArray } from './is'

/**
 * simple clone, use JSON.parse and JSON.stringify
 *
 * 简单的克隆,使用 JSON.parse 和 JSON.stringify
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
    const newError = new Constructor(source.message)

    newError.stack = source.stack
    newError.name = source.name
    newError.cause = source.cause

    return newError
  }

  if (typeof File !== 'undefined' && source instanceof File) {
    const newFile = new Constructor([source], source.name, { type: source.type, lastModified: source.lastModified })
    return newFile
  }

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

function deepCloneImpl<T>(
  valueToClone: any,
  objectToClone: T,
  stack = new Map<any, any>(),
): T {
  if (isPrimitive(valueToClone)) {
    return valueToClone as T
  }

  /* istanbul ignore if -- @preserve */
  if (stack.has(valueToClone)) {
    return stack.get(valueToClone) as T
  }

  if (Array.isArray(valueToClone)) {
    const result: any = Array.from({ length: valueToClone.length })
    stack.set(valueToClone, result)

    for (let i = 0; i < valueToClone.length; i++) {
      result[i] = deepCloneImpl(valueToClone[i], objectToClone, stack)
    }

    // For RegExpArrays
    if (Object.hasOwn(valueToClone, 'index')) {
      // @ts-ignore
      result.index = valueToClone.index
    }
    if (Object.hasOwn(valueToClone, 'input')) {
      // @ts-ignore
      result.input = valueToClone.input
    }

    return result as T
  }

  if (valueToClone instanceof Date) {
    return new Date(valueToClone.getTime()) as T
  }

  if (valueToClone instanceof RegExp) {
    const result = new RegExp(valueToClone.source, valueToClone.flags)

    result.lastIndex = valueToClone.lastIndex

    return result as T
  }

  if (valueToClone instanceof Map) {
    const result = new Map()
    stack.set(valueToClone, result)

    for (const [key, value] of valueToClone) {
      result.set(key, deepCloneImpl(value, objectToClone, stack))
    }

    return result as T
  }

  if (valueToClone instanceof Set) {
    const result = new Set()
    stack.set(valueToClone, result)

    for (const value of valueToClone) {
      result.add(deepCloneImpl(value, objectToClone, stack))
    }

    return result as T
  }

  // eslint-disable-next-line node/prefer-global/buffer
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(valueToClone)) {
    // @ts-ignore
    return valueToClone.subarray() as T
  }

  if (isTypedArray(valueToClone)) {
    const result = new (Object.getPrototypeOf(valueToClone).constructor)(valueToClone.length)
    stack.set(valueToClone, result)

    for (let i = 0; i < valueToClone.length; i++) {
      result[i] = deepCloneImpl(valueToClone[i], objectToClone, stack)
    }

    return result as T
  }

  if (
    valueToClone instanceof ArrayBuffer
    || (typeof SharedArrayBuffer !== 'undefined' && valueToClone instanceof SharedArrayBuffer)
  ) {
    return valueToClone.slice(0) as T
  }

  if (valueToClone instanceof DataView) {
    const result = new DataView(valueToClone.buffer.slice(0), valueToClone.byteOffset, valueToClone.byteLength)
    stack.set(valueToClone, result)

    copyProperties(result, valueToClone, objectToClone, stack)

    return result as T
  }

  // For legacy NodeJS support
  if (typeof File !== 'undefined' && valueToClone instanceof File) {
    const result = new File([valueToClone], valueToClone.name, {
      type: valueToClone.type,
    })
    stack.set(valueToClone, result)

    copyProperties(result, valueToClone, objectToClone, stack)

    return result as T
  }

  if (valueToClone instanceof Blob) {
    const result = new Blob([valueToClone], { type: valueToClone.type })
    stack.set(valueToClone, result)

    copyProperties(result, valueToClone, objectToClone, stack)

    return result as T
  }

  if (valueToClone instanceof Error) {
    const result = new (valueToClone.constructor as { new (): Error })()
    stack.set(valueToClone, result)

    result.message = valueToClone.message
    result.name = valueToClone.name
    result.stack = valueToClone.stack
    result.cause = valueToClone.cause

    copyProperties(result, valueToClone, objectToClone, stack)

    return result as T
  }

  if (typeof valueToClone === 'object' && valueToClone !== null) {
    const result = Object.create(Object.getPrototypeOf(valueToClone))

    stack.set(valueToClone, result)

    copyProperties(result, valueToClone, objectToClone, stack)

    return result as T
  }

  /* istanbul ignore next -- @preserve */
  return valueToClone
}

function copyProperties<T>(
  target: any,
  source: any,
  objectToClone: T = target,
  stack?: Map<any, any> | undefined,
): void {
  const keys = [...Object.keys(source), ...getSymbols(source)]

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const descriptor = Object.getOwnPropertyDescriptor(target, key)

    if (descriptor == null || descriptor.writable) {
      target[key] = deepCloneImpl(source[key], objectToClone, stack)
    }
  }
}

function getSymbols(object: any) {
  return Object.getOwnPropertySymbols(object).filter(symbol =>
    Object.prototype.propertyIsEnumerable.call(object, symbol),
  )
}
