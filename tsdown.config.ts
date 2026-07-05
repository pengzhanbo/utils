import type { Token as JSToken } from 'js-tokens'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import jsTokens from 'js-tokens'
import { format } from 'oxfmt'
import { defineConfig, type UserConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  clean: true,
  dts: true,
  format: 'esm',
  fixedExtension: false,
  async onSuccess() {
    const file = path.join(process.cwd(), 'dist/index.js')
    const content = await fs.promises.readFile(file, 'utf-8')
    const stripped = (
      await format(file, strip(content), {
        singleQuote: true,
        quoteProps: 'consistent',
        newlineBetween: false,
        semi: false,
        bracketSpacing: false,
      })
    ).code
    await fs.promises.writeFile(file, stripped, 'utf-8')
  },
}) as UserConfig

/**
 * 移除代码中的注释，保留代码本身
 */
export function strip(code: string): string {
  let result = ''

  for (const token of jsTokens(code, { jsx: false })) {
    result += stripFromToken(token)
  }

  return result
}

function stripFromToken(token: JSToken): string {
  if (token.type === 'SingleLineComment' || token.type === 'MultiLineComment') return ''

  return token.value
}
