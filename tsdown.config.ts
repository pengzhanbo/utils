import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { format } from 'oxfmt'
import { stripComments } from 'strip-comments-strings'
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
      await format(file, stripComments(content), {
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
