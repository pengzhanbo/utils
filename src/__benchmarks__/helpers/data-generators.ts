/**
 * Test Data Generators / 测试数据生成器
 *
 * 用于生成各种规模和类型的测试数据，确保基准测试的可重复性
 */

// ==================== Object Generators ====================

/** Generate a flat object with specified number of properties / 生成指定属性数量的扁平对象 */
export function generateFlatObject(propCount: number, prefix = 'prop'): Record<string, any> {
  const obj: Record<string, any> = {}
  for (let i = 0; i < propCount; i++) {
    obj[`${prefix}_${i}`] = generateRandomValue(i)
  }
  return obj
}

/** Generate a nested object with specified depth and width / 生成指定深度和宽度的嵌套对象 */
export function generateNestedObject(
  depth: number,
  width: number,
  currentDepth = 0,
): Record<string, any> {
  if (currentDepth >= depth) {
    return { value: Math.random() }
  }

  const obj: Record<string, any> = {}
  for (let i = 0; i < width; i++) {
    obj[`level${currentDepth}_${i}`] = generateNestedObject(depth, width, currentDepth + 1)
  }
  return obj
}

/** Generate an object with circular references / 生成包含循环引用的对象 */
export function generateCircularObject(): Record<string, any> {
  const obj: any = { a: 1, b: 2 }
  obj.self = obj
  obj.nested = { parent: obj, value: 3 }
  return obj
}

/** Generate an object with mixed types (Date, RegExp, Map, Set, etc.) / 生成包含特殊类型的混合对象 */
export function generateMixedTypeObject(): Record<string, any> {
  return {
    date: new Date(),
    regex: /test/gi,
    map: new Map([['key', 'value']]),
    set: new Set([1, 2, 3]),
    array: [1, 2, 3],
    nested: { a: { b: { c: 1 } } },
    nullValue: null,
    undefinedValue: undefined,
    number: 42,
    string: 'hello world',
    boolean: true,
  }
}

// ==================== Array Generators ====================

/** Generate a random number array / 生成随机数字数组 */
export function generateNumberArray(length: number, min = 0, max = 10000): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min)) + min)
}

/** Generate an array of objects using a factory function / 使用工厂函数生成对象数组 */
export function generateObjectArray<T extends Record<string, any>>(
  length: number,
  factory: (index: number) => T,
): T[] {
  return Array.from({ length }, (_, i) => factory(i))
}

/** Generate an array of user-like objects for sorting tests / 生成用于排序测试的用户数据数组 */
export function generateUserArray(length: number): Array<{
  id: number
  name: string
  age: number
  email: string
  createdAt: Date
}> {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia']

  return generateObjectArray(length, (i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    age: 18 + (i % 50),
    email: `user${i}@example.com`,
    createdAt: new Date(Date.now() - i * 86400000),
  }))
}

// ==================== String Generators ====================

/** Generate a long string with specified length / 生成长度指定的长字符串 */
export function generateLongString(length: number, charSet = 'abcdefghijklmnopqrstuvwxyz'): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charSet[Math.floor(Math.random() * charSet.length)]
  }
  return result
}

/**
 * Generate a template string with variables / 生成带变量的模板字符串
 * @returns An object containing the template and the values to fill it
 */
export function generateTemplateString(
  variableCount: number,
  textLength = 20,
): { template: string; values: Record<string, string> } {
  const values: Record<string, string> = {}
  let template = ''

  for (let i = 0; i < variableCount; i++) {
    if (i > 0) template += ' '
    template += generateLongString(textLength)
    template += `{{var_${i}}}`
    values[`var_${i}`] = `value_${i}`
  }
  template += generateLongString(textLength)

  return { template, values }
}

// ==================== Utility Functions ====================

/** Generate a random value based on seed / 根据种子生成随机值 */
function generateRandomValue(seed: number): any {
  const types = ['string', 'number', 'boolean', 'null']
  const type = types[seed % types.length]

  switch (type) {
    case 'string':
      return `value_${seed}`
    case 'number':
      return seed * 1.5
    case 'boolean':
      return seed % 2 === 0
    case 'null':
      return null
    default:
      return seed
  }
}
