import { hasOwn } from '../object/has-own.js'
import { isArray } from '../predicate/is-array.js'
import { isBuffer } from '../predicate/is-buffer.js'
import { isPrimitive } from '../predicate/is-primitive.js'
import { isTypedArray } from '../predicate/is-typed-array.js'
import { PROTO_KEY, T_OBJECT, T_UNDEFINED } from './tags.js'

const DEEP_CLONE_MAX_DEPTH = 1000

/**
 * @internal
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param valueToClone - The value to clone. 要克隆的值
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 * @returns The cloned value. 克隆后的值
 */
export function deepCloneImpl<T>(
  valueToClone: unknown,
  stack: Map<any, any> = new Map<any, any>(),
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

  return cloneValue(valueToClone, stack, depth) as T
}

/**
 * Dispatches a non-primitive value to its matching clone strategy.
 *
 * 将非原始值分派到对应的克隆策略。
 *
 * @internal
 * @param valueToClone - The value to clone. 要克隆的值
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 * @returns The cloned value. 克隆后的值
 */
function cloneValue(valueToClone: unknown, stack: Map<any, any>, depth: number): unknown {
  if (isArray(valueToClone)) {
    return cloneArray(valueToClone, stack, depth)
  }

  if (valueToClone instanceof Date) {
    return cloneDate(valueToClone, stack)
  }

  if (valueToClone instanceof RegExp) {
    return cloneRegExp(valueToClone, stack)
  }

  if (valueToClone instanceof Map) {
    return cloneMap(valueToClone, stack, depth)
  }

  if (valueToClone instanceof Set) {
    return cloneSet(valueToClone, stack, depth)
  }

  if (isBuffer(valueToClone)) {
    return cloneBuffer(valueToClone, stack)
  }

  if (isTypedArray(valueToClone)) {
    return cloneTypedArray(valueToClone, stack)
  }

  if (
    valueToClone instanceof ArrayBuffer ||
    // eslint-disable-next-line valid-typeof
    (typeof SharedArrayBuffer !== T_UNDEFINED && valueToClone instanceof SharedArrayBuffer)
  ) {
    return cloneArrayBuffer(valueToClone, stack)
  }

  if (valueToClone instanceof DataView) {
    return cloneDataView(valueToClone, stack, depth)
  }

  // For legacy NodeJS support
  // eslint-disable-next-line valid-typeof
  if (typeof File !== T_UNDEFINED && valueToClone instanceof File) {
    return cloneFile(valueToClone, stack, depth)
  }

  if (valueToClone instanceof Blob) {
    return cloneBlob(valueToClone, stack, depth)
  }

  if (valueToClone instanceof AggregateError) {
    return cloneAggregateError(valueToClone, stack, depth)
  }

  if (valueToClone instanceof Error) {
    return cloneError(valueToClone, stack, depth)
  }

  /* istanbul ignore if -- @preserve */
  // oxlint-disable-next-line valid-typeof
  if (typeof valueToClone === T_OBJECT) {
    return cloneObject(valueToClone as object, stack, depth)
  }

  /* istanbul ignore next -- @preserve */
  return valueToClone
}

/**
 * @internal
 * @param valueToClone - The array to clone. 要克隆的数组
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 * @returns The cloned array. 克隆后的数组
 */
function cloneArray(valueToClone: any[], stack: Map<any, any>, depth: number): any[] {
  const len = valueToClone.length
  let isPrimitiveArray = true
  for (let i = 0; i < len; i++) {
    const v = valueToClone[i]
    if (v != null && typeof v === 'object') {
      isPrimitiveArray = false
      break
    }
  }

  // oxlint-disable-next-line unicorn/no-new-array -- Array.from({ length }) would densify holes; the length form is intentional
  const result: any = isPrimitiveArray ? valueToClone.slice() : new Array(len)
  stack.set(valueToClone, result)

  if (!isPrimitiveArray) {
    for (let i = 0; i < len; i++) {
      if (hasOwn(valueToClone, i)) {
        result[i] = deepCloneImpl(valueToClone[i], stack, depth + 1)
      }
    }
  }

  copyRegExpMatchProps(result, valueToClone, stack, depth)

  return result
}

/**
 * @internal
 * @param valueToClone - The date to clone. 要克隆的日期
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @returns The cloned date. 克隆后的日期
 */
function cloneDate(valueToClone: Date, stack: Map<any, any>): Date {
  const result = new Date(valueToClone.getTime())
  stack.set(valueToClone, result)
  return result
}

/**
 * @internal
 * @param valueToClone - The regexp to clone. 要克隆的正则
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @returns The cloned regexp. 克隆后的正则
 */
function cloneRegExp(valueToClone: RegExp, stack: Map<any, any>): RegExp {
  const result = new RegExp(valueToClone.source, valueToClone.flags)
  result.lastIndex = valueToClone.lastIndex
  stack.set(valueToClone, result)
  return result
}

/**
 * @internal
 * @param valueToClone - The map to clone. 要克隆的 Map
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 * @returns The cloned map. 克隆后的 Map
 */
function cloneMap(valueToClone: Map<any, any>, stack: Map<any, any>, depth: number): Map<any, any> {
  const result = new Map()
  stack.set(valueToClone, result)

  for (const [key, value] of valueToClone) {
    result.set(deepCloneImpl(key, stack, depth + 1), deepCloneImpl(value, stack, depth + 1))
  }

  return result
}

/**
 * @internal
 * @param valueToClone - The set to clone. 要克隆的 Set
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 * @returns The cloned set. 克隆后的 Set
 */
function cloneSet(valueToClone: Set<any>, stack: Map<any, any>, depth: number): Set<any> {
  const result = new Set()
  stack.set(valueToClone, result)

  for (const value of valueToClone) {
    result.add(deepCloneImpl(value, stack, depth + 1))
  }

  return result
}

/**
 * @internal
 * @param valueToClone - The buffer to clone. 要克隆的 Buffer
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @returns The cloned buffer. 克隆后的 Buffer
 */
function cloneBuffer(valueToClone: Buffer, stack: Map<any, any>): Buffer {
  const result = Buffer.from(valueToClone)
  stack.set(valueToClone, result)
  return result
}

/**
 * @internal
 * @param valueToClone - The typed array to clone. 要克隆的类型化数组
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @returns The cloned typed array. 克隆后的类型化数组
 */
function cloneTypedArray(valueToClone: ArrayBufferView, stack: Map<any, any>): ArrayBufferView {
  const Constructor = Object.getPrototypeOf(valueToClone).constructor
  const result = new Constructor(valueToClone)
  stack.set(valueToClone, result)
  return result
}

/**
 * @internal
 * @param valueToClone - The array buffer to clone. 要克隆的 ArrayBuffer
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @returns The cloned array buffer. 克隆后的 ArrayBuffer
 */
function cloneArrayBuffer(
  valueToClone: ArrayBuffer | SharedArrayBuffer,
  stack: Map<any, any>,
): ArrayBuffer | SharedArrayBuffer {
  const result = valueToClone.slice(0)
  stack.set(valueToClone, result)
  return result
}

/**
 * @internal
 * @param valueToClone - The data view to clone. 要克隆的 DataView
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 * @returns The cloned data view. 克隆后的 DataView
 */
function cloneDataView(valueToClone: DataView, stack: Map<any, any>, depth: number): DataView {
  const result = new DataView(
    valueToClone.buffer.slice(0),
    valueToClone.byteOffset,
    valueToClone.byteLength,
  )
  stack.set(valueToClone, result)

  copyProperties(result, valueToClone, stack, depth)

  return result
}

/**
 * @internal
 * @param valueToClone - The file to clone. 要克隆的 File
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 * @returns The cloned file. 克隆后的 File
 */
function cloneFile(valueToClone: File, stack: Map<any, any>, depth: number): File {
  const result = new File([valueToClone], valueToClone.name, {
    type: valueToClone.type,
    lastModified: valueToClone.lastModified,
  })
  stack.set(valueToClone, result)

  copyProperties(result, valueToClone, stack, depth)

  return result
}

/**
 * @internal
 * @param valueToClone - The blob to clone. 要克隆的 Blob
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 * @returns The cloned blob. 克隆后的 Blob
 */
function cloneBlob(valueToClone: Blob, stack: Map<any, any>, depth: number): Blob {
  const result = new Blob([valueToClone], { type: valueToClone.type })
  stack.set(valueToClone, result)

  copyProperties(result, valueToClone, stack, depth)

  return result
}

/**
 * @internal
 * @param valueToClone - The aggregate error to clone. 要克隆的 AggregateError
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 * @returns The cloned aggregate error. 克隆后的 AggregateError
 */
function cloneAggregateError(
  valueToClone: AggregateError,
  stack: Map<any, any>,
  depth: number,
): AggregateError {
  const result = new AggregateError([], valueToClone.message)
  const prototype = Object.getPrototypeOf(valueToClone)

  if (Object.getPrototypeOf(result) !== prototype) {
    Object.setPrototypeOf(result, prototype)
  }

  stack.set(valueToClone, result)

  result.errors = deepCloneImpl(valueToClone.errors, stack, depth + 1)

  if (hasOwn(valueToClone, 'cause')) {
    Object.defineProperty(result, 'cause', {
      value: deepCloneImpl(valueToClone.cause, stack, depth + 1),
      writable: true,
      enumerable: false,
      configurable: true,
    })
  }

  if (hasOwn(valueToClone, 'name')) {
    result.name = valueToClone.name
  }

  result.stack = valueToClone.stack

  copyProperties(result, valueToClone, stack, depth)

  return result
}

/**
 * @internal
 * @param valueToClone - The error to clone. 要克隆的 Error
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 * @returns The cloned error. 克隆后的 Error
 */
function cloneError(valueToClone: Error, stack: Map<any, any>, depth: number): Error {
  const result = new (valueToClone.constructor as { new (...args: any[]): Error })(
    valueToClone.message,
    { cause: deepCloneImpl(valueToClone.cause, stack, depth + 1) },
  )
  stack.set(valueToClone, result)

  if (hasOwn(valueToClone, 'name')) {
    result.name = valueToClone.name
  }

  result.stack = valueToClone.stack

  copyProperties(result, valueToClone, stack, depth)

  return result
}

/**
 * @internal
 * @param valueToClone - The object to clone. 要克隆的对象
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 * @returns The cloned object. 克隆后的对象
 */
function cloneObject(valueToClone: object, stack: Map<any, any>, depth: number): object {
  const result: object = Object.create(Object.getPrototypeOf(valueToClone))
  stack.set(valueToClone, result)

  copyProperties(result, valueToClone, stack, depth)

  return result
}

/**
 * @internal
 * @param target - The target array. 目标数组
 * @param source - The source array. 源数组
 * @param stack - The stack of cloned values. 已克隆值的栈
 * @param depth - The current depth. 当前深度
 */
function copyRegExpMatchProps(target: any, source: any, stack: Map<any, any>, depth = 0): void {
  if (hasOwn(source, 'index')) {
    target.index = source.index
  }

  if (hasOwn(source, 'input')) {
    target.input = source.input
  }

  if (hasOwn(source, 'groups')) {
    target.groups = deepCloneImpl(source.groups, stack, depth + 1)
  }

  if (hasOwn(source, 'indices')) {
    target.indices = deepCloneImpl(source.indices, stack, depth + 1)
  }
}

/**
 * @internal
 * @param target - The target object. 目标对象
 * @param source - The source object. 源对象
 * @param stack - The stack of objects to avoid circular references. 避免循环引用的对象栈
 * @param depth - The current depth of the recursion. 当前递归深度
 */
export function copyProperties(
  target: object,
  source: object,
  stack?: Map<any, any>,
  depth = 0,
): void {
  const stringKeys = Object.keys(source)

  for (let i = 0; i < stringKeys.length; i++) {
    copyKey(source, target, stringKeys[i]!, stack, depth)
  }

  if (Object.getOwnPropertySymbols(source).length === 0) {
    return
  }

  const symbolKeys = getSymbols(source)

  for (let i = 0; i < symbolKeys.length; i++) {
    copyKey(source, target, symbolKeys[i]!, stack, depth)
  }
}

/**
 * @internal
 * @param source - The source object. 源对象
 * @param target - The target object. 目标对象
 * @param key - The key to copy. 要复制的键
 * @param stack - The stack of objects to avoid circular references. 避免循环引用的对象栈
 * @param depth - The current depth of the recursion. 当前递归深度
 */
function copyKey(
  source: any,
  target: any,
  key: string | symbol,
  stack?: Map<any, any>,
  depth = 0,
): void {
  if (key === PROTO_KEY) {
    return
  }
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
 *
 * @param object - The object to get symbols from. 要获取符号的对象
 * @returns The symbols on the object. 对象上的符号
 */
export function getSymbols(object: unknown): symbol[] {
  return Object.getOwnPropertySymbols(object).filter((symbol) =>
    Object.prototype.propertyIsEnumerable.call(object, symbol),
  )
}
