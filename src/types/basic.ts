/**
 * Prettifies the type of an object
 *
 * Make complex intersection types display as more readable flattened structures in the IDE
 *
 * 美化对象的类型
 *
 * 使复杂的交叉类型在IDE中显示为更易读的扁平结构
 *
 * @category Types
 *
 * @template T - 要美化的类型
 *
 * @example
 * ```ts
 * type ComplexType = { name: string } & { age: number } & { address: string }
 * // display as -> { name: string } & { age: number } & { address: string }
 * // use `Prettify`
 * type PrettyType = Prettify<{ name: string } & { age: number } & { address: string }>
 * // display as -> { name: string; age: number; address: string }
 * ```
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

/**
 * Primitive types
 *
 * 原始类型
 *
 * @category Types
 */
export type Primitive = null | undefined | string | number | boolean | symbol | bigint

/**
 * Constructor
 *
 * 构造函数类型
 *
 * @category Types
 *
 * @template T - 构造函数返回的实例类型
 */
export type Constructor<T = void> = new (...arg: any[]) => T

/**
 * Infers the element type of an array
 *
 * 推断数组元素的类型
 *
 * @category Types
 *
 * @template T - 要推断的数组类型
 */
export type ElementOf<T> = T extends (infer E)[] ? E : never

/**
 * make keys required but keep undefined values
 *
 * 使键成为必需但保留 undefined 值
 *
 * @category Types
 *
 * @template T - 原始对象类型
 */
export type LooseRequired<T> = { [P in keyof (T & Required<T>)]: T[P] }

/**
 * Negate a boolean type
 *
 * 否定布尔类型
 *
 * @category Types
 *
 * @template A - 要否定的布尔类型
 */
export type Not<A extends boolean> = A extends true ? false : A extends false ? true : never
