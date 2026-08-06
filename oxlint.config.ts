import config from '@pengzhanbo/oxc-config/oxlint'

export default config({
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
})
