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

const { sample, formData } = defineFormSchemaSample({
  title: 'Playground',
  schema: {
    gridSize: 8,
    fieldSize: 8,
    fullScreen: true,
    fields: [
      {
        key: 'products',
        type: 'info',
        label: 'Products',
        content: () => {
          return (
            <div onClick={() => openForm()}>
              OPEN
            </div>
          )
        },

      },

    ],
  },
})

export default { sample }
