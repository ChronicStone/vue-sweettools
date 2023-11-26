import { buildExcelSchema, useExcelReader } from '@chronicstone/vue-sweettools'

const emailRegex = new RegExp(
  '^(([^<>()[\\]\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}'
  + '\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+'
  + '[a-zA-Z]{2,}))$',
)

const schema = buildExcelSchema([
  {
    key: 'firstName',
    label: 'First name',
    validation: { required: true },
    format: { trim: true },
    example: 'JOHN',
  },
  {
    key: 'lastName',
    label: 'Last name',
    validation: { required: true },
    format: { trim: true, uppercase: true },
    example: 'DOE',
  },
  {
    key: 'otherName',
    label: 'Last name',
    validation: { required: false, rule: emailRegex, hahja: true },
    format: { trim: true },
    example: 'POE',
  },
  {
    key: 'email',
    label: 'Email adress',
    validation: { required: true },
    format: { trim: true },
    example: 'john.doe@mail.com',
  },
  {
    key: 'tags',
    label: 'Tags',
    validation: { required: false },
    multiple: true,
    format: { trim: true },
    example: 'tag1,tag2,tag3',
  },
])

const { validRows } = useExcelReader(null as any, schema)

export default {
  title: 'Excel',
  schema: buildExcelSchema([
    {
      key: 'firstName',
      label: 'First name',
      validation: { required: true },
      format: { trim: true },
      example: 'JOHN',
    },
    {
      key: 'lastName',
      label: 'Last name',
      validation: { required: true },
      format: { trim: true, uppercase: true },
      example: 'DOE',
    },
    {
      key: 'otherName',
      label: 'Last name',
      validation: { required: false, rule: emailRegex, hahja: true },
      format: { trim: true },
      example: 'POE',
    },
    {
      key: 'email',
      label: 'Email adress',
      validation: { required: true },
      format: { trim: true },
      example: 'john.doe@mail.com',
    },
    {
      key: 'tags',
      label: 'Tags',
      validation: { required: false },
      multiple: true,
      format: { trim: true },
      example: 'tag1,tag2,tag3',
    },
  ]),
}
