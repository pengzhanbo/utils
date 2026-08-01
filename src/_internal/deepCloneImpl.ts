import { hasOwn } from '../object'
import { isPrimitive, isTypedArray } from '../predicate'
import { T_OBJECT, T_UNDEFINED } from './tags'

const DEEP_CLONE_MAX_DEPTH = 1000

function copyRegExpMatchProps(target: any, source: any, stack: Map<any, any>, depth = 0): void {
  if (hasOwn(source, 'index')) {
    // @ts-ignore
    target.index = source.index
  }
  if (hasOwn(source, 'input')) {
    // @ts-ignore
    target.input = source.input
  }
  if (hasOwn(source, 'groups')) {
    // @ts-ignore
    target.groups = deepCloneImpl(source.groups, stack, depth + 1)
  }
  if (hasOwn(source, 'indices')) {
    // @ts-ignore
    target.indices = deepCloneImpl(source.indices, stack, depth + 1)
  }
}

/**
 * @internal
 * @typeParam T - The type of elements in the array / 数组元素的类型
 */
export function deepCloneImpl<T>(
  valueToClone: any,
  stack: Map<any, any> = new Map(),
  depth = 0,
): T {
  if (isPrimitive(valueToClone)) {
    return valueToClone as T
  }

  if (depth >= DEEP_CLONE_MAX_DEPTH) {
    throw new RangeError(`deepClone: maximum depth of ${DEEP_CLONE_MAX_DEPTH} exceeded`)
  }

  /* istanbul ignore if -- @preserve */
  if (stack.has(valueToClone)) {
    return stack.get(valueToClone) as T
  }

  if (Array.isArray(valueToClone)) {
    const len = valueToClone.length
    let isPrimitiveArray = true
    for (let i = 0; i < len; i++) {
      const v = valueToClone[i]
      if (v != null && typeof v === 'object') {
        isPrimitiveArray = false
        break
      }
    }

    if (isPrimitiveArray) {
      const result = valueToClone.slice()
      stack.set(valueToClone, result)

      copyRegExpMatchProps(result, valueToClone, stack, depth)

      return result as T
    }

    // oxlint-disable-next-line unicorn/no-new-array -- Array.from({ length }) would densify holes; the length form is intentional
    const result: any = new Array(len)
    stack.set(valueToClone, result)

    for (let i = 0; i < len; i++) {
      if (hasOwn(valueToClone, i)) result[i] = deepCloneImpl(valueToClone[i], stack, depth + 1)
    }

    copyRegExpMatchProps(result, valueToClone, stack, depth)

    return result as T
  }

  if (valueToClone instanceof Date) {
    const result = new Date(valueToClone.getTime())
    stack.set(valueToClone, result)
    return result as T
  }

  if (valueToClone instanceof RegExp) {
    const result = new RegExp(valueToClone.source, valueToClone.flags)

    result.lastIndex = valueToClone.lastIndex
    stack.set(valueToClone, result)

    return result as T
  }

  if (valueToClone instanceof Map) {
    const result = new Map()
    stack.set(valueToClone, result)

    for (const [key, value] of valueToClone) {
      result.set(deepCloneImpl(key, stack, depth + 1), deepCloneImpl(value, stack, depth + 1))
    }

    return result as T
  }

  if (valueToClone instanceof Set) {
    const result = new Set()
    stack.set(valueToClone, result)

    for (const value of valueToClone) {
      result.add(deepCloneImpl(value, stack, depth + 1))
    }

    return result as T
  }

  // oxlint-disable-next-line valid-typeof
  if (typeof Buffer !== T_UNDEFINED && Buffer.isBuffer(valueToClone)) {
    const result = Buffer.from(valueToClone)
    stack.set(valueToClone, result)
    // @ts-ignore
    return result as T
  }

  if (isTypedArray(valueToClone)) {
    const Constructor = Object.getPrototypeOf(valueToClone).constructor
    const result = new Constructor(valueToClone)
    stack.set(valueToClone, result)

    return result as T
  }

  if (
    valueToClone instanceof ArrayBuffer ||
    // eslint-disable-next-line valid-typeof
    (typeof SharedArrayBuffer !== T_UNDEFINED && valueToClone instanceof SharedArrayBuffer)
  ) {
    const result = valueToClone.slice(0)
    stack.set(valueToClone, result)
    return result as T
  }

  if (valueToClone instanceof DataView) {
    const result = new DataView(
      valueToClone.buffer.slice(0),
      valueToClone.byteOffset,
      valueToClone.byteLength,
    )
    stack.set(valueToClone, result)

    copyProperties(result, valueToClone, stack, depth)

    return result as T
  }

  // For legacy NodeJS support
  // eslint-disable-next-line valid-typeof
  if (typeof File !== T_UNDEFINED && valueToClone instanceof File) {
    const result = new File([valueToClone], valueToClone.name, {
      type: valueToClone.type,
      lastModified: valueToClone.lastModified,
    })
    stack.set(valueToClone, result)

    copyProperties(result, valueToClone, stack, depth)

    return result as T
  }

  if (valueToClone instanceof Blob) {
    const result = new Blob([valueToClone], { type: valueToClone.type })
    stack.set(valueToClone, result)

    copyProperties(result, valueToClone, stack, depth)

    return result as T
  }

  if (valueToClone instanceof Error) {
    const result = new (valueToClone.constructor as { new (...args: any[]): Error })(
      valueToClone.message,
      { cause: deepCloneImpl(valueToClone.cause, stack, depth + 1) },
    )
    stack.set(valueToClone, result)

    if (hasOwn(valueToClone, 'name')) result.name = valueToClone.name

    result.stack = valueToClone.stack

    copyProperties(result, valueToClone, stack, depth)

    return result as T
  }

  /* istanbul ignore if -- @preserve */
  // eslint-disable-next-line valid-typeof
  if (typeof valueToClone === T_OBJECT && valueToClone !== null) {
    const result = Object.create(Object.getPrototypeOf(valueToClone))

    stack.set(valueToClone, result)

    copyProperties(result, valueToClone, stack, depth)

    return result as T
  }

  /* istanbul ignore next -- @preserve */
  return valueToClone
}

/**
 * @internal
 */
export function copyProperties(
  target: any,
  source: any,
  stack?: Map<any, any> | undefined,
  depth = 0,
): void {
  const stringKeys = Object.keys(source)
  const symbolKeys = getSymbols(source)

  for (let i = 0; i < stringKeys.length; i++) copyKey(source, target, stringKeys[i]!, stack, depth)
  for (let i = 0; i < symbolKeys.length; i++) copyKey(source, target, symbolKeys[i]!, stack, depth)
}

/**
 * @internal
 */
function copyKey(source: any, target: any, key: string | symbol, stack?: Map<any, any>, depth = 0) {
  if (key === '__proto__') return
  const sourceDescriptor = Object.getOwnPropertyDescriptor(source, key)
  if (sourceDescriptor != null && 'value' in sourceDescriptor) {
    const targetDescriptor = Object.getOwnPropertyDescriptor(target, key)
    if (targetDescriptor == null || targetDescriptor.writable) {
      target[key] = deepCloneImpl(sourceDescriptor.value, stack, depth + 1)
    }
  }
}

/**
 * @internal
 */
export function getSymbols(object: any): symbol[] {
  return Object.getOwnPropertySymbols(object).filter((symbol) =>
    Object.prototype.propertyIsEnumerable.call(object, symbol),
  )
}
