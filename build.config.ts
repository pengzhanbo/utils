import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: 'src',
      format: 'cjs',
      outDir: 'dist/cjs',
      // fix: #1
      // mkdist 支持 `cjs` ，但在 unbuild 中类型未能正确声明
      ext: 'cjs' as any,
      pattern: ['**/*.ts', '!**/*.test.ts'],
      // cjs 应该生成 d.cts，但目前 mkdist 未能正确生成
      declaration: true,
    },
    {
      builder: 'mkdist',
      input: 'src',
      format: 'esm',
      outDir: 'dist/esm',
      ext: 'mjs',
      pattern: ['**/*.ts', '!**/*.test.ts'],
      declaration: true,
    },
  ],
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
  },
})
