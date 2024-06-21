import { defineFormSchemaSample } from '../utils'

const { sample, formData } = defineFormSchemaSample({
  title: 'Playground',
  data: {
    locales: [{ locale: 'fr', name: 'Français' }, { locale: 'en', name: 'English' }],
  },
  schema: {
    gridSize: 8,
    fieldSize: 8,
    fullScreen: true,
    fields: [
      {
        label: 'Locales',
        type: 'object',
        key: 'locales',
        transform: v => [{ locale: 'en', name: v.en }, { locale: 'fr', name: v.fr }],
        preformat: v => !v
          ? { en: '', fr: '' }
          : ({
              en: v.find(({ locale }) => locale === 'en')?.name,
              fr: v.find(({ locale }) => locale === 'fr')?.name,
            }),
        fields: [
          {
            key: 'en',
            type: 'text',
            label: 'English',
            required: true,
          },
          {
            key: 'fr',
            type: 'text',
            label: 'French',
            required: true,
          },
        ],
      },
    ],
  },
})

export default { sample }
