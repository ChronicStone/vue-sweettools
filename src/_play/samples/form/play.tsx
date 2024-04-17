import { z } from 'zod'
import { defineFormSchemaSample } from '../utils'
import { useApp } from '@/_play/composables/useApp'

const options = {
  active: ['Active', 'Inactive'],
  descriptive: ['Descriptive', 'Non-descriptive'],
  required: ['Required', 'Optional'],
  disabled: ['Disabled', 'Enabled'],
}

function openForm() {
  const { formApi } = useApp()

  formApi.createForm({
    gridSize: 8,
    fieldSize: 8,
    fullScreen: true,
    fields: [
      {
        key: 'product',
        type: 'select',
        label: 'Product',
        options: ['Product 1', 'Product 2'],
      },
      {
        key: 'quantity',
        type: 'number',
        label: 'Quantity',
      },
    ],

  })
}
// WHOLE ALPHABET
const marksDto = z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'])

const { sample, formData } = defineFormSchemaSample({
  title: 'Playground',
  data: {
    'date-test': new Date(),
    'daterange-test': [new Date(), new Date().setDate(new Date().getDate() + 7)],
    'tags': ['tag1', 'tag2'],
  },
  schema: {
    gridSize: 8,
    fieldSize: 8,
    fullScreen: true,
    fields: [
      {
        label: 'Tags',
        key: 'tags',
        type: 'tag',
        fieldParams: {
          draggable: true,
        },
      },
      {
        label: 'Slider with ticks',
        type: 'slider',
        key: 'slider',
        fieldParams: {
          range: true,
          step: 'mark',
          min: 0,
          max: Object.keys(marksDto.Enum).length - 1,
          formatTooltip: (value: number) => Object.values(marksDto.Enum)[value],
          marks: Object.keys(marksDto.Enum).reduce((acc, key, index) => {
            acc[index] = key
            return acc
          }, {} as Record<number, string>),
        },
        transform: (value: number[]) => value.map(v => Object.values(marksDto.Enum)[v]),
        preformat: (value: string[]) => value.map(v => Object.values(marksDto.Enum).indexOf(v as any)),
        default: ['A', 'B'],
      },
      {
        key: 'slider-2',
        type: 'slider',
        fieldParams: {
          range: true,
          step: 1,
          min: 0,
          max: 100,
          // formatTooltip: (value: number) => Object.values(marksDto.Enum)[value],
          // marks: Object.keys(marksDto.Enum).reduce((acc, key, index) => {
          //   acc[index] = key
          //   return acc
          // }, {} as Record<number, string>),
        },
        // transform: (value: number[]) => value.map(v => Object.values(marksDto.Enum)[v]),
        default: [0, 100],
      },
      {
        key: 'date-test',
        type: 'date',
        label: 'Date',
      },
      {
        key: 'daterange-test',
        type: 'daterange',
        label: 'Date Range',
      },

    ],
  },
})

export default { sample }
