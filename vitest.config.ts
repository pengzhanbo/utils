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
      all: false,
      reporter: ['text', 'clover', 'json'],
    },
  },
})
