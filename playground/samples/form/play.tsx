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
        label: 'test',
        key: 'files',
        type: 'upload',
        output: 'object',
        multiple: true,
        uploadHandler: (options) => {
          const file = options.file.file
          if (!file)
            return options.onError()

          const fileDataUrl = URL.createObjectURL(file)
          options.file.url = fileDataUrl
          options.onFinish()
        },
        fieldParams: {
          enableDragDrop: true,
          listType: 'image',
        },
      },
    ],
  },
})

export default { sample }
