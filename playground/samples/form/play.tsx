import { defineFormSchemaSample } from '../utils'

const { sample, formData } = defineFormSchemaSample({
  title: 'Playground',
  data: {
    array: [
      {
        name: 'John',
      },
    ],
  },
  schema: {
    gridSize: 8,
    fieldSize: 8,
    fields: [
      {
        label: 'Month range',
        key: 'monthRange',
        type: 'monthrange',
      },
    ],
  },
})

export default { sample }
