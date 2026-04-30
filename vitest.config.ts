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
  },
})
