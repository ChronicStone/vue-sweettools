import { defineFormSchemaSample } from '../utils'

const { sample, formData } = defineFormSchemaSample({
  title: 'Basic form - field types',
  description: 'This form shows all the available field types.',

  schema: {
    title: 'Basic form - field types',
    fullScreen: true,
    fields: [
      { key: 'text', label: 'Text', type: 'text', required: true },
      {
        key: 'treeSelect',
        label: 'Tree select',
        type: 'tree-select',
        multiple: true,
        options: [
          {
            label: 'test1',
            key: 'test1',
            children: [{ label: 'test1.1', key: 'test1.1' }],
          },
          {
            label: 'test2',
            key: 'test2',
            children: [{ label: 'test2.1', key: 'test2.1' }],
          },
        ],
        fieldParams: {
          multiple: true,
          cascade: true,
          checkStrategy: 'child',
          showPath: false,
          checkable: true,
        },
      },
      {
        key: 'textarea',
        label: 'Textarea',
        type: 'textarea',
        size: 8,
        required: true,
      },
      { key: 'number', label: 'Number', type: 'number', required: true },
      { key: 'password', label: 'Password', type: 'password' },
      {
        key: 'slider',
        label: 'Slider',
        type: 'slider',
        required: true,
        fieldParams: { min: 175, max: 252, step: 1 },
      },
      {
        type: 'select',
        key: 'select',
        label: 'Select',
        options: () => [...(['France', 'Spain', 'Italy', 'Germany'] as const)],
      },
      {
        type: 'radio',
        key: 'radio',
        label: 'Radio',
        options: () => [...(['France', 'Spain', 'Italy', 'Germany'] as const)],
        size: 8,
      },
      { type: 'checkbox', key: 'checkbox', label: 'Checkbox', size: 8 },
      {
        type: 'checkbox-group',
        key: 'checkboxGroup',
        label: 'Checkbox group',
        gridSize: '1 md:2 lg:4 xl:5',
        size: '8',
        options: () =>
          Array.from({ length: 64 }, (_, i) => `Option ${i}` as const),
      },
      {
        type: 'date',
        key: 'date',
        label: 'Date',
        fieldParams: { format: 'd MMM yyyy' },
      },
      {
        key: 'time',
        label: 'Time',
        type: 'time',
      },
      {
        key: 'datetime',
        label: 'Date time',
        type: 'datetime',
        fieldParams: { format: 'd MMM yyyy HH:mm:ss' },
      },
      { key: 'datetimeRange', label: 'Date time range', type: 'datetimerange' },
      { key: 'month', label: 'Date time range', type: 'year' },
      { key: 'color', type: 'color-picker', label: 'Color' },
      {
        key: 'object',
        label: 'Object',
        type: 'object',
        required: true,
        gridSize: '8',
        size: '8',
        fields: [
          {
            key: 'string',
            label: 'String',
            type: 'text',
            size: '8 md:4',
            required: true,
          },
          {
            key: 'number',
            label: 'Number',
            type: 'text',
            size: '8 md:4',
            required: true,
          },
          {
            key: 'slider',
            label: 'Slider',
            type: 'slider',
            size: '8',
            required: true,
          },
        ],
      },
      {
        key: 'array',
        label: 'Array',
        type: 'array-tabs',
        size: '8',
        fields: [
          {
            key: 'string',
            label: 'String',
            type: 'text',
            size: '8 md:4',
            required: true,
          },
          {
            key: 'number',
            label: 'Number',
            type: 'text',
            size: '8 md:4',
            required: true,
          },
          {
            key: 'slider',
            label: 'Slider',
            type: 'slider',
            size: '8',
            required: true,
          },
        ],
      },
      {
        label: 'Array variant',
        key: 'arrayVariant',
        type: 'array-variant',
        displayMode: 'tabs',
        variantKey: 'type',
        variants: [
          {
            key: 'type1',
            label: 'Type 1',
            fields: [
              { key: 'text', label: 'Text', type: 'text', required: true },
              {
                key: 'number',
                label: 'Number',
                type: 'number',
                required: true,
              },
            ],
          },
        ],
      },
    ],
  },
})

// type Result = Expect<Equal<typeof sample.formData, { text: string }>>;

export default { sample }
