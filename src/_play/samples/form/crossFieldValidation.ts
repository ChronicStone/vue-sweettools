import { email, helpers, sameAs } from '@vuelidate/validators'
import { defineFormSchemaSample } from '../utils'

// eslint-disable-next-line unused-imports/no-unused-vars
const { sample, formData } = defineFormSchemaSample({
  title: 'Cross field validation with dependencies',
  description:
    'This sample shows how to use cross field validation with dependencies, to create a simple password confirmation field.',
  schema: {
    title: 'Password & password confirmation',
    gridSize: 8,
    fieldSize: '8 md:4',
    maxWidth: '750px',
    fields: [
      {
        key: 'email',
        label: 'Email address',
        type: 'text',
        required: true,
        validators: { email },
        size: 8,
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
      },
      {
        key: 'passwordConfirmation',
        label: 'Password confirmation',
        type: 'password',
        dependencies: ['password'],
        required: true,
        validators: dependencies => ({
          sameAsPassword: helpers.withMessage(
            'The password and the confirmation does not match',
            sameAs(dependencies?.password),
          ),
        }),
      },
    ],
  },
})

export default { sample }
