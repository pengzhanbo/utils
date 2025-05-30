import { isPrimitive, isTypedArray } from '../is'
import { hasOwn } from '../object'

export function deepCloneImpl<T>(
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
    const result = new (valueToClone.constructor as { new (...args: any[]): Error })(valueToClone.message, { cause: valueToClone.cause })
    stack.set(valueToClone, result)

    if (hasOwn(valueToClone, 'name'))
      result.name = valueToClone.name

    result.stack = valueToClone.stack

    copyProperties(result, valueToClone, objectToClone, stack)

    return result as T
  }

  /* istanbul ignore if -- @preserve */
  if (typeof valueToClone === 'object' && valueToClone !== null) {
    const result = Object.create(Object.getPrototypeOf(valueToClone))

    stack.set(valueToClone, result)

    copyProperties(result, valueToClone, objectToClone, stack)

    return result as T
  }

  /* istanbul ignore next -- @preserve */
  return valueToClone
}

export function copyProperties<T>(
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

export function getSymbols(object: any) {
  return Object.getOwnPropertySymbols(object).filter(symbol =>
    Object.prototype.propertyIsEnumerable.call(object, symbol),
  )
}
