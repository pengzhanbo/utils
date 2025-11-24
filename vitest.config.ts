import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.[tj]s'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/lib/**',
    ],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'clover', 'json'],
    },
  },
})
