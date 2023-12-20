import { defineFormSchemaSample } from '../utils'

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
        key: 'text',
        type: 'text',
        label: 'Text',
      },
      {
        label: 'Text 2',
        key: 'text2',
        type: 'select',
        dependencies: ['text'],
        options: deps => !deps.text ? ['hello', 'hey', 'bruh'] : ['a', 'b', 'c'],
      },

    ],
  },
})

export default { sample }
