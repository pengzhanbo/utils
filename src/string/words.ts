/**
 * This pattern matches sequences of characters in a string, considering the following cases:
 * - Sequences of two or more uppercase letters followed by an uppercase letter and lowercase letters or digits (for acronyms)
 * - Sequences of one uppercase letter optionally followed by lowercase letters and digits
 * - Single uppercase letters
 * - Sequences of digits
 * - Emojis and other Unicode characters
 *
 * The resulting match can be used to convert camelCase, snake_case, kebab-case,
 * and other mixed formats into a consistent format like snake case.
 * It also supports emojis and other Unicode characters.
 *
 * 这个模式匹配字符串中的字符序列，考虑以下情况:
 * - 两个或更多大写字母后跟着大写字母和小写字母或数字的序列（用于缩写）
 * - 一个大写字母可选地后跟着小写字母和数字的序列
 * - 单个大写字母
 * - 数字的序列
 * - Emoji 和其他 Unicode 字符
 *
 * 匹配结果可用于将驼峰式、蛇形、短横线式及其他混合格式转换为统一的格式，
 * 如蛇形命名法。同时支持表情符号及其他 Unicode 字符。
 *
 * @category String
 *
 * @example
 * ```ts
 * const matched = 'caseCaseHTMLResponse🚀'.match(CASE_SPLIT_PATTERN)
 * // ['case', 'Case', 'HTML', 'Response', '🚀']
 * ```
 * @internal
 */
export const CASE_SPLIT_PATTERN: RegExp =
  /\p{Lu}?\p{Ll}+|\d+|\p{Lu}+(?!\p{Ll})|[\p{Emoji_Presentation}\p{Extended_Pictographic}]|\p{L}+/gu

/**
 * Split string into as words array
 *
 * 将字符串拆分为单词数组
 *
 * @category String
 *
 * @param str - the string to split 要拆分的字符串
 * @returns an array of words 单词数组
 *
 * @example
 * ```ts
 * words('helloWorld🚀') // => ['hello', 'world', '🚀']
 * ```
 */
export function words(str: string): string[] {
  if (!str) return []
  return Array.from(str.match(CASE_SPLIT_PATTERN) ?? [])
}
