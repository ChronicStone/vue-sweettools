import { helpers, minLength } from '@vuelidate/validators'
import { defineFormSchemaSample } from '../utils'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function resolveAsyncOptions() {
  await sleep(3500)
  return Array.from({ length: 10 }).map((_, i) => `Item_${i}`)
}

const { sample, formData } = defineFormSchemaSample({
  title: 'Custom actions / Scoped APIs',
  data: {},
  schema: {
    fieldSize: 8,
    gridSize: 8,
    fields: [
      {
        label: 'Array reactive',
        type: 'array-list',
        key: 'array',
        actions: {
          moveDown: false,
          moveUp: false,
          deleteItem: value => Object.values(value).every(v => !v),
          addItem: items => items.length < 3,
          custom: [
            {
              label: 'Custom action',
              icon: 'mdi:plus',
              action: (api) => {
                api.setValue(`$parent.${api.index}.item2`, 'HAHAHA')
                nextTick(() =>
                  console.log(
                    'item',
                    api.getValue(`$parent.${api.index}.item2`),
                  ),
                )
              },
            },
          ],
        },
        fields: [
          {
            label: 'Item',
            type: 'text',
            key: 'item',
            watch(value, { setValue, getOptions }) {
              const options = getOptions('$parent.item3')
              console.log('context', options)
              setValue('$parent.item2', value)
            },
          },
          {
            label: 'Item2',
            type: 'text',
            key: 'item2',
          },
          {
            label: 'Item2',
            type: 'select',
            key: 'item3',
            dependencies: [['$parent.item', 'item']],
            options: deps => (deps.item ? ['1', '2', '3'] : []),
          },
          {
            label: 'Item n',
            type: 'number',
            key: 'item4',
            fieldParams: { min: 0, max: 10 },
          },
        ],
      },
    ],
  },
})

export default { sample }
