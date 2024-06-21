import { defineFormSchemaSample } from '../utils'

const { sample, formData } = defineFormSchemaSample({
  title: 'Basic multi-step form',
  description: 'Example of a basic multi-step form',
  data: {
    userIdentity: {
      firstName: 'John',
      lastName: 'Doe',
    },
  },
  schema: {
    gridSize: 8,
    fieldSize: '8 md:4',
    overlayOpacity: 0.95,
    maxWidth: '700px',
    steps: [
      {
        icon: 'mdi:plus',
        title: 'User information',
        root: 'userIdentity',
        fields: [
          // firstName, lastName, email, birthDate, address, city, zipCode, country
          {
            key: 'firstName',
            type: 'text',
            label: 'First name',
            required: false,
            preformat: v => v?.trim()?.toUpperCase(),
          },
          { key: 'lastName', type: 'text', label: 'Last name', required: false },
          { key: 'email', type: 'text', label: 'Email', required: false },
          {
            key: 'birthDate',
            type: 'date',
            label: 'Birth date',
            required: false,
          },
          { key: 'address', type: 'text', label: 'Address', required: false },
          { key: 'city', type: 'text', label: 'City', required: false },
          { key: 'zipCode', type: 'text', label: 'ZIP code', required: false },
          {
            key: 'country',
            type: 'select',
            label: 'Country',
            required: false,
            options: [...(['France', 'Belgium', 'Germany', 'Spain'] as const)],
          },
        ],
      },
      {
        icon: 'mdi:account-multiple',
        title: 'Address',
        root: 'userAddress',
        fields: [
          { key: 'isSomething1', type: 'checkbox', label: 'Some long sentence 1 to test the width of the stepper', size: 8 },
          { key: 'isSomething2', type: 'checkbox', label: 'Some long sentence 2 to test the width of the stepper', size: 8 },
          { key: 'isSomething3', type: 'checkbox', label: 'Some long sentence 3 to test the width of the stepper', size: 8 },
          { key: 'isSomething4', type: 'checkbox', label: 'Some long sentence 4 to test the width of the stepper', size: 8 },
          { key: 'isSomething5', type: 'checkbox', label: 'Some long sentence 5 to test the width of the stepper', size: 8 },
        ],
      },
      {
        title: 'Organizations',
        fields: (['orgaList', 'orgaTabs'] as const).map((key, index) => ({
          key,
          type: `array-${index === 0 ? 'tabs' : 'list'}`,
          label: `Organizations (${index === 0 ? 'tabs' : 'list'})`,
          size: 8,
          fields: [
            { key: 'name', type: 'text', label: 'Org name', required: true },
            {
              key: 'address',
              type: 'text',
              label: 'Text',
              required: true,
            },
            { key: 'city', type: 'text', label: 'City', required: true },
            {
              key: 'zipCode',
              type: 'text',
              label: 'Text',
              required: true,
            },
            {
              key: 'country',
              type: 'select',
              label: 'Text',
              required: true,
              options: [
                ...(['France', 'Belgium', 'Germany', 'Spain'] as const),
              ],
            },
          ],
        })),
      },
      {
        fields: [
          {
            key: 'acceptsCGU',
            type: 'checkbox',
            label: 'Text',
            required: true,
          },
          {
            key: 'acceptsNewsletter',
            type: 'checkbox',
            label: 'Text',
            required: true,
          },
        ],
      },
    ],
  },
})

export default { sample }
