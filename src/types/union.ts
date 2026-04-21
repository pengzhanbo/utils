import type { IsNever } from './is'
/**
 * Convert a union type to an intersection type using [distributive conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
 *
 * 使用[分配条件类型](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types)将联合类型转换为交叉类型。
 *
 * @see https://stackoverflow.com/a/50375286/2172153
 *
 * @category Types
 */
export type UnionToIntersection<Union> =
  // `extends unknown` is always going to be the case and is used to convert the
  // `Union` into a [distributive conditional type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  (
    Union extends unknown
      ? // The union type is used as the only argument to a function since the union
        // of function arguments is an intersection.
        (distributedUnion: Union) => void
      : // This won't happen.
        never
  ) extends (mergedIntersection: infer Intersection) => void // arguments of unions of functions as an intersection of the union. // Infer the `Intersection` type since TypeScript represents the positional
    ? // The `& Union` is to ensure result of `UnionToIntersection<A | B>` is always assignable to `A | B`
      Intersection & Union
    : never

/**
 * Returns the last element of a union type.
 *
 * 返回联合类型的最后一个元素。
 *
 * @internal
 */
export type LastOfUnion<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never

/**
 * Convert a union type into an unordered tuple type of its elements.
 *
 * "Unordered" means the elements of the tuple are not guaranteed to be in the same order as in the union type. The arrangement can appear random and may change at any time.
 *
 * This can be useful when you have objects with a finite set of keys and want a type defining only the allowed keys, but do not want to repeat yourself.
 *
 * 将联合类型转换为其元素的无序元组类型。
 *
 * “无序”意味着元组中的元素不一定与联合类型中的顺序相同。排列可以显得随机，并且可能会随时改变。
 *
 * 当你有具有有限键集的对象，并且希望定义仅允许的键的类型，但又不想重复自己时，这会很有用。
 *
 * @category Types
 *
 * @example
 * ```ts
 * type Numbers = 1 | 2 | 3
 * type NumbersTuple = UnionToTuple<Numbers>
 * //=> [1, 2, 3]
 * ```
 *
 * @example
 * ```ts
 * const pets = {
 *   dog: '🐶',
 *   cat: '🐱',
 *   snake: '🐍',
 * }
 *
 * type Pet = keyof typeof pets;
 * //=> 'dog' | 'cat' | 'snake'
 *
 * const petList = Object.keys(pets) as UnionToTuple<Pet>;
 * //=> ['dog', 'cat', 'snake']
 * ```
 */
export type UnionToTuple<T, L = LastOfUnion<T>> =
  IsNever<T> extends false ? [...UnionToTuple<Exclude<T, L>>, L] : []

/**
 * A literal type that supports custom further strings but preserves autocompletion in IDEs.
 *
 * 支持自定义进一步字符串但保留IDE自动完成的字面量类型。
 *
 * @see https://github.com/microsoft/TypeScript/issues/29729#issuecomment-471566609
 *
 * @category Types
 */
export type LiteralUnion<Union extends Base, Base = string> =
  | Union
  | (Base & { __zz_IGNORE_ME__?: never })
