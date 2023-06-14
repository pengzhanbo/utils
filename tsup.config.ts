import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  clean: true,
  sourcemap: false,
  splitting: false,
  format: ['cjs', 'esm'],
  noExternal: ['throttle-debounce'],
})
