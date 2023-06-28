import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: 'src',
      format: 'cjs',
      outDir: 'dist/cjs',
      ext: 'cjs',
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
