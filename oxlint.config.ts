import config from '@pengzhanbo/oxc-config/oxlint'

export default config(
  {
    regexp: true,
    settings: {
      jsdoc: {
        tagNamePreference: {
          category: 'category',
          typeParam: 'typeParam',
          module: 'module',
          remarks: 'remarks',
          hideCategories: 'hideCategories',
        },
      },
    },
  },
  {
    // Benchmarks measure performance instead of asserting / 基准测试只测量性能，不做断言
    files: ['**/*.{bench,benchmark}.{js,ts,jsx,tsx,cjs,mjs,cts,mts}'],
    plugins: ['vitest'],
    rules: {
      'vitest/expect-expect': 'off',
    },
  },
)
