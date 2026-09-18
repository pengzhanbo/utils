import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.[tj]s'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/lib/**'],
    env: { TZ: 'Etc/UTC' },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'clover', 'json'],
    },
    benchmark: {
      // Benchmarks measure the source implementation, so accept the module runner getter overhead
      // 基准测试直接测量源码实现，接受模块运行器的 getter 开销
      suppressExportGetterWarnings: true,
    },
  },
})
