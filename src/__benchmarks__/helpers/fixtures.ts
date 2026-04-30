/**
 * Fixed Test Fixtures / 固定测试数据集
 *
 * 使用硬编码数据确保每次运行结果一致，用于基准测试
 */

// ==================== Small Datasets (for quick tests) ====================

/** Small flat object with 5 properties / 小型扁平对象（5个属性） */
export const SMALL_OBJECT = { a: 1, b: 'test', c: { d: 2 }, e: [1, 2, 3] } as const

/** Small array of numbers / 小型数字数组 */
export const SMALL_ARRAY = [1, 2, 3, 4, 5] as const

/** Small template string / 小型模板字符串 */
export const SMALL_TEMPLATE = 'Hello {{name}}, your score is {{score}}!' as const

/** Small template values / 小型模板值 */
export const SMALL_TEMPLATE_VALUES = { name: 'World', score: '100' } as const

// ==================== Medium Datasets (for regular testing) ====================

/** Medium flat object with 100 properties / 中型扁平对象（100个属性） */
export const MEDIUM_FLAT_OBJECT: Record<string, any> = Object.fromEntries(
  Array.from({ length: 100 }, (_, i) => [`prop_${i}`, i]),
)

/** Medium nested object (10 sections × 10 items) / 中型嵌套对象 */
export const MEDIUM_NESTED_OBJECT: Record<string, any> = (() => {
  const obj: any = {}
  for (let i = 0; i < 10; i++) {
    obj[`section_${i}`] = Object.fromEntries(
      Array.from({ length: 10 }, (_, j) => [`item_${j}`, i * 10 + j]),
    )
  }
  return obj
})()

/** Medium array with 1000 elements / 中型数组（1000个元素） */
export const MEDIUM_ARRAY: number[] = Array.from({ length: 1000 }, (_, i) => i)

/** Medium user array for sorting (100 users) / 中型用户数组（用于排序测试，100个用户） */
export const MEDIUM_USER_ARRAY: any[] = (() => {
  const names: string[] = ['Alice', 'Bob', 'Charlie', 'David', 'Eve']
  const departments: string[] = ['Engineering', 'Marketing', 'Sales']
  return Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: names[i % names.length] as string,
    age: 20 + (i % 40),
    score: Math.floor(Math.random() * 100),
    department: departments[i % 3] as string,
  }))
})()

// ==================== Large Datasets (for stress testing) ====================

/** Large flat object with 10000 properties / 大型扁平对象（10000个属性） */
export const LARGE_FLAT_OBJECT: Record<string, any> = Object.fromEntries(
  Array.from({ length: 10000 }, (_, i) => [`prop_${i}`, { value: i, nested: { deep: i * 2 } }]),
)

/** Large array with 100000 items / 大型数组（100000个项目） */
export const LARGE_ARRAY: any[] = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  value: Math.random(),
  name: `Item_${i}`,
}))

// ==================== Special Type Datasets ====================

/** Object containing special types (Date, RegExp, Map, Set, etc.) / 包含特殊类型的对象 */
export const SPECIAL_TYPE_OBJECT: Record<string, any> = {
  date: new Date('2024-01-01'),
  regex: /^test.*$/gi,
  map: new Map(Array.from({ length: 10 }, (_, i) => [`key_${i}`, i])),
  set: new Set([1, 2, 3, 4, 5]),
  error: new Error('test error'),
  arrayBuffer: new ArrayBuffer(16),
}

/** Circular reference object for deep clone testing / 用于深度克隆测试的循环引用对象 */
export const CIRCULAR_OBJECT: any = { id: 1 }
CIRCULAR_OBJECT.self = CIRCULAR_OBJECT
CIRCULAR_OBJECT.children = [{ parent: CIRCULAR_OBJECT }]

// ==================== Template Datasets ====================

/** Template with medium complexity (10 variables, 20 chars each) / 中等复杂度模板 */
export const MEDIUM_TEMPLATE: Record<string, any> = (() => {
  let template = ''
  const values: Record<string, string> = {}

  for (let i = 0; i < 10; i++) {
    if (i > 0) template += ' '
    template += 'abcdefghijklmnopqrstuvwxyz'.slice(0, 20)
    template += `{{var_${i}}}`
    values[`var_${i}`] = `value_${i}`
  }
  template += 'abcdefghijklmnopqrstuvwxyz'.slice(0, 20)

  return { template, values }
})()

/** Template with high variable density (20 variables in 100 chars) / 高密度变量模板 */
export const DENSE_TEMPLATE: Record<string, any> = (() => {
  let template = ''
  const values: Record<string, string> = {}

  for (let i = 0; i < 20; i++) {
    template += `{{v${i}}}`
    values[`v${i}`] = `val${i}`
  }

  return { template, values }
})()

// ==================== Merge Test Datasets ====================

/** Multiple source objects for merge testing / 多源对象合并测试数据 */
export const MERGE_SOURCES: any[] = [
  { a: 1, b: 2, c: { d: 3 } },
  { b: 20, e: 5, f: { g: 6 } },
  { a: 10, h: 7, i: { j: 8 } },
]

/** Source objects with arrays for deepMergeWithArray testing / 包含数组的源对象 */
export const MERGE_WITH_ARRAY_SOURCES: any[] = [
  { arr: [1, 2], obj: { x: 1 } },
  { arr: [3, 4], obj: { y: 2 } },
  { arr: [5], obj: { z: 3 } },
]
