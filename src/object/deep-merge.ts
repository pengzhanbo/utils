import { DANGEROUS_KEYS, T_OBJECT } from '../_internal/tags'
import { isArray, isNil, isNull } from '../predicate'

/**
 * Deep merge
 *
 * The first argument is the target object, the rest are the sources.
 * The target object will be mutated and returned.
 *
 * 深度合并
 *
 * 第一个参数是目标对象，其余的是源对象。
 * 目标对象将被修改并返回。
 *
 * @category Object
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param target - The target object / 目标对象
 * @param sources - The source objects / 源对象
 * @returns The merged object / 合并后的对象
 *
 * @remarks
 * This function mutates the target object in place and returns it.
 * Dangerous keys (`__proto__`, `constructor`, `prototype`) are silently filtered out and not merged.
 * Only plain objects (those with `Object.prototype` or `null` as prototype) are deep-merged; other types (e.g., arrays, Date, Map, Set) are replaced rather than merged.
 * For array-aware merging, use {@link deepMergeWithArray} instead.
 *
 * 此函数会直接修改目标对象并将其返回。
 * 危险键（`__proto__`、`constructor`、`prototype`）会被静默过滤，不会参与合并。
 * 只有普通对象（原型为 `Object.prototype` 或 `null` 的对象）会进行深度合并；其他类型（如数组、Date、Map、Set）会被直接替换。
 * 如需合并数组，请使用 {@link deepMergeWithArray}。
 */
export function deepMerge<
  T extends Record<PropertyKey, any>,
  S extends Record<PropertyKey, any> = T,
>(target: T, ...sources: S[]): DeepMerge<T, S> {
  for (let s = 0; s < sources.length; s++) {
    const source = sources[s]
    if (!isMergableObject(source)) continue
    if (!isMergableObject(target)) continue

    const keys = Object.keys(source)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!
      if (DANGEROUS_KEYS.has(key)) continue

      const sourceVal = source[key]
      if (isMergableObject(sourceVal)) {
        const targetVal = target[key]
        if (isMergableObject(targetVal)) {
          deepMerge(targetVal, sourceVal)
        } else {
          // @ts-expect-error target[key] can be any
          target[key] = deepMerge({}, sourceVal)
        }
      } else {
        // @ts-expect-error target[key] can be any
        target[key] = sourceVal
      }
    }
  }

  return target as any
}

/**
 * Deep merge
 *
 * Differs from `deepMerge` in that it merges arrays instead of overriding them.
 *
 * The first argument is the target object, the rest are the sources.
 * The target object will be mutated and returned.
 *
 * 深度合并
 *
 * 与 `deepMerge` 不同，它合并数组而不是覆盖它们。
 *
 * 第一个参数是目标对象，其余的是源。
 * 目标对象将被修改并返回。
 *
 * @category Object
 *
 * @param target - The target object / 目标对象
 * @param sources - The source objects / 源对象
 * @returns The merged object / 合并后的对象
 */
export function deepMergeWithArray<
  T extends Record<PropertyKey, any>,
  S extends Record<PropertyKey, any> = T,
>(target: T, ...sources: S[]): DeepMerge<T, S> {
  for (let s = 0; s < sources.length; s++) {
    const source = sources[s]
    if (isNil(source)) continue

    if (isArray(target) && isArray(source)) target.push(...source)

    if (!isMergableObject(target) || !isMergableObject(source)) continue

    const keys = Object.keys(source)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!
      if (DANGEROUS_KEYS.has(key)) continue

      const sourceVal = source[key]
      if (isArray(sourceVal)) {
        const targetVal = target[key]
        if (isArray(targetVal)) {
          deepMergeWithArray(targetVal, sourceVal)
        } else if (isNil(targetVal)) {
          // @ts-expect-error target[key] can be any
          target[key] = []
          deepMergeWithArray(target[key], sourceVal)
        } else {
          // @ts-expect-error target[key] can be any
          target[key] = sourceVal
        }
      } else if (isMergableObject(sourceVal)) {
        const targetVal = target[key]
        if (isMergableObject(targetVal)) {
          deepMergeWithArray(targetVal, sourceVal)
        } else {
          // @ts-expect-error target[key] can be any
          target[key] = {}
          deepMergeWithArray(target[key], sourceVal)
        }
      } else {
        // @ts-expect-error target[key] can be any
        target[key] = sourceVal
      }
    }
  }

  return target as any
}

function isMergableObject(item: any): item is Record<PropertyKey, any> {
  // oxlint-disable-next-line valid-typeof
  if (typeof item !== T_OBJECT || isNull(item)) return false
  const proto = Object.getPrototypeOf(item)
  if (isNull(proto)) return true
  return proto === Object.prototype
}

type MergeInsertions<T> = T extends object ? { [K in keyof T]: MergeInsertions<T[K]> } : T

/**
 * Deep merge
 */
type DeepMerge<F, S> = MergeInsertions<{
  [K in keyof F | keyof S]: K extends keyof S & keyof F
    ? DeepMerge<F[K], S[K]>
    : K extends keyof S
      ? S[K]
      : K extends keyof F
        ? F[K]
        : never
}>
