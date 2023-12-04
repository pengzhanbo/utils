import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: 'src',
      format: 'cjs',
      outDir: 'dist/cjs',
      // fix: #1
      ext: 'cjs' as any,
      pattern: ['**/*.ts', '!**/*.test.ts'],
    },
    {
      builder: 'mkdist',
      input: 'src',
      format: 'esm',
      outDir: 'dist/esm',
      ext: 'mjs',
      pattern: ['**/*.ts', '!**/*.test.ts'],
    },
  ],
  outDir: 'dist',
  declaration: true,
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
  },
})
