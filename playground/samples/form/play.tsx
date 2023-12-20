import { defineFormSchemaSample } from '../utils'

const options = {
  active: ['Active', 'Inactive'],
  descriptive: ['Descriptive', 'Non-descriptive'],
  required: ['Required', 'Optional'],
  disabled: ['Disabled', 'Enabled'],
}

const { sample, formData } = defineFormSchemaSample({
  title: 'Playground',
  data: {
    array: [
      {
        id: 1,
        name: 'John',
      },
    ],
  },
  schema: {
    gridSize: 8,
    fieldSize: 8,
    fields: [
      {
        key: 'products',
        type: 'array-list',
        label: 'Products',
        fields: [
          {
            key: 'type',
            options: () => Object.keys(options),
            type: 'select',
          },
          {
            key: 'value',
            type: 'select',
            dependencies: [['$parent.type', 'type']],
            options: deps => options[deps.type as keyof typeof options],
          },
        ],
      },

    ],
  },
})

export default { sample }
