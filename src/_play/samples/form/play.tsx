import { defineFormSchemaSample } from '../utils'

const { sample, formData } = defineFormSchemaSample({
  title: 'Basic form - field types',
  description: 'This form shows all the available field types.',
  data: {
    array: [{ value: 'a', id: 1 }, { value: 'b', id: 2 }, { value: 'c', id: 3 }],
  },
  schema: {
    title: 'Basic form - field types',
    fullScreen: true,
    dirtyCheck: true,
    fields: [
      {
        type: 'array-list',
        key: 'array',
        label: 'Array',
        extraProperties: true,
        fields: [
          {
            key: 'value',
            label: 'Value',
            type: 'text',
            required: true,
            transform: v => v?.trim()?.toUpperCase() as string,
            conditionEffect: 'disable',
            condition: () => false,
          },
        ],
      },
    ],
  },
})

// type Result = Expect<Equal<typeof sample.formData, { text: string }>>;

export default { sample }
