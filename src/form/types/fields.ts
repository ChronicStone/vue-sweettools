import type { Validation, ValidationArgs } from '@vuelidate/core'
import type {
  CascaderOption,
  ImageGroupProps,
  InputProps,
  SelectGroupOption,
  SelectOption,
  SelectRenderLabel,
  SelectRenderTag,
  TreeSelectOption,
  UploadCustomRequestOptions,
  UploadFileInfo,
  UploadSettledFileInfo,
} from 'naive-ui'
import type { SelectBaseOption } from 'naive-ui/es/select/src/interface'
import type { Component, VNode, VNodeChild } from 'vue'
import type { MaskOptions } from 'maska'
import type { FileInfo } from 'naive-ui/es/upload/src/interface'
import type { useFieldContext } from '../composables/useFieldContext'
import type { Narrowable, Primitive } from '@/_shared/types/utils'

export enum FieldTypes {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT = 'select',
  SWITCH = 'switch',
  CHECKBOX = 'checkbox',
  CHECKBOX_GROUP = 'checkbox-group',
  RADIO = 'radio',
  SLIDER = 'slider',
  TEXTAREA = 'textarea',
  PASSWORD = 'password',
  DATE = 'date',
  DATE_TIME = 'datetime',
  DATE_RANGE = 'daterange',
  DATE_TIME_RANGE = 'datetimerange',
  MONTH = 'month',
  YEAR = 'year',
  TIME = 'time',
  CUSTOM_COMPONENT = 'custom-component',
  OBJECT = 'object',
  ARRAY_LIST = 'array-list',
  ARRAY_TABS = 'array-tabs',
  INFO = 'info',
  TREE_SELECT = 'tree-select',
  RATING = 'rating',
  TAG = 'tag',
  CASCADER = 'cascader',
  GROUP = 'group',
  ARRAY_VARIANT = 'array-variant',
  COLOR_PICKER = 'color-picker',
  UPLOAD = 'upload',
}

export type TFieldTypes = `${FieldTypes}`

export type Dependencies = Record<string, any>

export type _CoreFieldOptions =
  | (number | string)[]
  | SelectOption[]
  | TreeSelectOption[]
  | CascaderOption[]
  | readonly (string | number)[]
  | readonly SelectOption[]
  | readonly TreeSelectOption[]
  | readonly CascaderOption[]

export type _FieldOptions =
  | _CoreFieldOptions
  | ((
    dependencies: Dependencies,
    fieldApi: ReadonlyFieldApi
  ) => _CoreFieldOptions)
  | ((
    dependencies: Dependencies,
    fieldApi: ReadonlyFieldApi
  ) => Promise<_CoreFieldOptions>)

export type FieldOptionCreator =
  | ((
    deps: Dependencies,
    fieldApi: ReadonlyFieldApi
  ) =>
  | _CoreFieldOptions[number]
  | null
  | void
  | Promise<_CoreFieldOptions[number] | null | void>)
  | {
    label: string
    icon?: string
    selectOnCreation?: boolean
    revalidateFieldOptions?: Array<string>
    handler: (
      deps: Dependencies,
      fieldApi: ReadonlyFieldApi
    ) =>
    | _CoreFieldOptions[number]
    | null
    | void
    | Promise<_CoreFieldOptions[number] | null | void>
  }

export interface TextFieldProps {
  minLength?: number
  maxLength?: number
  showCharacterCount?: boolean
  prefix?: string | (() => VNodeChild)
  suffix?: string | (() => VNodeChild)
  mask?: string | MaskOptions
}

export interface TextField {
  type: 'text'
  clearable?: boolean
  fieldParams?:
  | TextFieldProps
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => TextFieldProps)
}

export interface TreeSelectFieldProps {
  cascade?: boolean
  checkStrategy?: 'all' | 'parent' | 'child'
  childrenField?: string
  valueField?: string
  labelField?: string
  disabledField?: string
  maxSelectedCount?: number | 'responsive'
  clearFilterAfterSelect?: boolean
  allowCheckingNotLoaded?: boolean
  filterable?: boolean
  placement?:
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  remote?: boolean
  separator?: string
  showPath?: boolean
  virtualScroll?: boolean
  renderLabel?: (option: {
    option: TreeSelectOption
    checked: boolean
    selected: boolean
  }) => VNodeChild
  filter?: (
    pattern: string,
    option: TreeSelectOption,
    path: TreeSelectOption[]
  ) => boolean
  filterMenuProps?: Record<string, any>
}

export interface TreeSelectField {
  type: 'tree-select'
  clearable?: boolean
  multiple?: boolean
  options: _FieldOptions
  fieldParams?:
  | TreeSelectFieldProps
  | ((
    deps: Dependencies,
    fieldApi: ReadonlyFieldApi
  ) => TreeSelectFieldProps)
}

export interface CascaderFieldParams {
  cascade?: boolean
  checkable?: boolean
  checkStrategy?: 'all' | 'parent' | 'child'
  childrenField?: string
  valueField?: string
  labelField?: string
  disabledField?: string
  maxSelectedCount?: number | 'responsive'
  clearFilterAfterSelect?: boolean
  allowCheckingNotLoaded?: boolean
  filterable?: boolean
  placement?:
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  remote?: boolean
  separator?: string
  showPath?: boolean
  virtualScroll?: boolean
  renderLabel?: SelectRenderLabel
  renderPrefix?: (option: CascaderOption, checked: boolean) => VNodeChild
  renderSuffix?: (option: CascaderOption, checked: boolean) => VNodeChild
  renderSwitcherIcon?: (option: CascaderOption, checked: boolean) => VNodeChild
  renderTag?: SelectRenderTag
  filter?: (
    pattern: string,
    option: CascaderOption,
    path: CascaderOption[]
  ) => boolean
  filterMenuProps?: Record<string, unknown>
}

export interface CascaderField {
  type: 'cascader'
  clearable?: boolean
  options: _FieldOptions
  multiple?: boolean
  fieldParams?:
  | CascaderFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => CascaderFieldParams)
}

export interface TextAreaFieldParams extends TextFieldProps {
  autosize?: boolean | { minRows?: number; maxRows?: number }
  showCount?: boolean
}

export interface TextAreaField {
  type: 'textarea'
  clearable?: boolean
  fieldParams?:
  | TextAreaFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => TextAreaFieldParams)
}

export interface TagFieldParams {
  deletable?: boolean
  type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  tagStyle?: string | Record<string, Primitive>
  onCreate?:
  | ((label: string) => string)
  | ((label: string) => { label: string; value: string })
  rounded?: boolean
  max?: number
  inputProps?: InputProps
  renderTag?:
  | ((tag: string, index: number) => VNodeChild)
  | ((tag: { label: string; value: string }, index: number) => VNodeChild)
}

export interface TagField {
  type: 'tag'
  fieldParams?:
  | TagFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => TagFieldParams)
}

export interface PasswordField extends Omit<TextField, 'type' | 'pair'> {
  type: 'password'
  clearable?: boolean
}

export interface SelectFieldParams {
  filterable?: boolean
  renderLabel?: (
    option: SelectOption | SelectGroupOption,
    selected: boolean
  ) => VNodeChild
  renderOption?: (info: {
    node: VNode
    option: SelectOption | SelectGroupOption
    selected: boolean
  }) => VNodeChild
  renderTag?: (props: {
    option: SelectBaseOption
    handleClose: () => void
  }) => VNodeChild
  createTags?: boolean
  virtualScroll?: boolean
}

export interface SelectField {
  type: 'select'
  clearable?: boolean
  options: _FieldOptions
  multiple?: boolean
  fieldParams?:
  | SelectFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => SelectFieldParams)
  createOption?: FieldOptionCreator
  allowOptionsRefresh?: boolean
}

export interface NumberFieldParams {
  min?: number
  max?: number
  step?: number
  prefix?: string | (() => VNodeChild)
  suffix?: string | (() => VNodeChild)
}

export interface NumberField {
  type: 'number'
  clearable?: boolean
  fieldParams?:
  | NumberFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => NumberFieldParams)
}

export interface ColorPickerFieldParams {
  showPreview?: boolean
  showAlpha?: boolean
  renderLabel?: (color: string | null) => VNodeChild
  modes?: Array<'rgb' | 'hex' | 'hsl' | 'hsv'>
  swatches?: string[]
  actions?: Array<'clear' | 'confirm'>
}

export interface ColorPickerField {
  type: 'color-picker'
  fieldParams?:
  | ColorPickerFieldParams
  | ((
    deps: Dependencies,
    fieldApi: ReadonlyFieldApi
  ) => ColorPickerFieldParams)
}

export interface RatingFieldParams {
  renderIcon?: () => VNodeChild
  color?: string
  iconCount?: number
  size: 'small' | 'medium' | 'large' | number
  allowHalf?: boolean
}

export interface RatingField {
  type: 'rating'
  fieldParams?:
  | RatingFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => RatingFieldParams)
}

export interface SliderFieldParams {
  min?: number
  max?: number
  step?: number
  range?: boolean
  reverse?: boolean
  enableTooltip?: boolean
  formatTooltip?: (value: number) => string | number
  // alwaysShowTooltip?: boolean;
  // tooltipPlacement?:
  //     | "top-start"
  //     | "top"
  //     | "top-end"
  //     | "right-start"
  //     | "right"
  //     | "right-end"
  //     | "bottom-start"
  //     | "bottom"
  //     | "bottom-end"
  //     | "left-start"
  //     | "left"
  //     | "left-end";
  marks?: { [markValue: number]: string }
}

export interface SliderField {
  type: 'slider'
  fieldParams?:
  | SliderFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => SliderFieldParams)
}

export interface SwitchFieldParams {
  checkedStyle?: string
  uncheckedStyle?: string
  checkedValue?: string | boolean | number
  uncheckedValue?: string | boolean | number
}

export interface SwitchField {
  type: 'switch'
  fieldParams?:
  | SwitchFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => SwitchFieldParams)
}

export interface RadioField {
  type: 'radio'
  options: _FieldOptions
}

export interface CheckboxFieldParams {
  checkedValue?: string | boolean | number
  uncheckedValue?: string | boolean | number
}

export interface CheckboxField {
  type: 'checkbox'
  fieldParams?:
  | CheckboxFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => CheckboxFieldParams)
}

export interface CheckboxGroupFieldParams {
  minChecked?: number
  maxChecked?: number
}

export interface CheckboxGroupField {
  type: 'checkbox-group'
  options: _FieldOptions
  fieldParams?:
  | CheckboxGroupFieldParams
  | ((deps: CheckboxGroupFieldParams) => CheckboxGroupFieldParams)
}

export interface TimeFieldParams {
  bottomActions?: Array<'now' | 'confirm'> | null
  displayedHours?: number | number[]
  displayedMinutes?: number | number[]
  displayedSeconds?: number | number[]
  disableHour?: (hour: number) => boolean
  disableMinute?: (minute: number, hour: number | null) => boolean
  disableSecond?: (
    second: number,
    minute: number | null,
    hour: number | null
  ) => boolean
  format?: string
  hourStep?: number
  minuteStep?: number
  secondStep?: number
}

export interface TimeField {
  type: 'time'
  clearable?: boolean
  fieldParams?:
  | TimeFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => TimeFieldParams)
}

export interface DateFieldParams {
  dateDisabled?: (current: number) => boolean
  timeDisabled?: (current: number) => boolean
  separator?: string
  format?: string
  valueFormat?: string
}

export type DateField = {
  type: 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'year'
  clearable?: boolean
  fieldParams?:
  | DateFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => DateFieldParams)
} & (
  | {
    type: 'date' | 'datetime' | 'month' | 'year'
    transform?: (value: string | null) => string
  }
  | {
    type: 'daterange' | 'datetimerange'
    transform?: (value: [string, string] | null) => string[]
  }
)

export type UploadFieldParams = {
  abstract?: boolean
  accept?: string
  action?: string
  customRequest?: (options: UploadCustomRequestOptions) => void
  data?: object | ((opts: { file: UploadFileInfo }) => object)
  headers?: object | ((opts: { file: UploadFileInfo }) => object)
  inputProps?: Record<string, unknown>
  defaultFileList?: UploadFileInfo[]
  uploadOnSelection?: boolean
  allowDirectory?: boolean
  fileListStyle?: string | Record<string, string>
  imageGroupProps?: ImageGroupProps
  isErrorState?: (xhr: XMLHttpRequest) => boolean
  max?: number
  method?: 'POST' | 'PUT' | 'PATCH'
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text'
  renderFileIcon?: (file: UploadSettledFileInfo) => VNodeChild
  shouldUseThumbnailUrl?: (file: UploadSettledFileInfo) => boolean
  showCancelButton?: boolean
  showDownloadButton?: boolean
  showRemoveButton?: boolean
  showPreviewButton?: boolean
  showRetryButton?: boolean
  showFileList?: boolean
  beforeUpload?: (data: {
    file: UploadFileInfo
    fileList: UploadFileInfo[]
  }) => boolean | Promise<boolean>
  onChange?: (options: {
    file: UploadFileInfo
    fileList: Array<UploadFileInfo>
    event?: Event
  }) => void
  onError?: (options: {
    file: UploadFileInfo
    event?: ProgressEvent
  }) => UploadFileInfo | void
  onFinish?: (options: {
    file: UploadFileInfo
    event?: Event
  }) => UploadFileInfo | undefined
  onDownload?: (file: FileInfo) => void
  onPreview?: (file: FileInfo) => void
  onRemove?: (options: {
    file: UploadFileInfo
    fileList: Array<UploadFileInfo>
  }) => Promise<boolean> | boolean | any
} & (
  | {
    enableDragDrop?: false
    listType?: 'text' | 'image' | 'image-card'
  }
  | {
    enableDragDrop?: true
    listType?: 'text' | 'image'
  }
)

export interface UploadField {
  type: 'upload'
  multiple?: boolean
  fieldParams?:
  | UploadFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => UploadFieldParams)
}

export interface GroupField<FieldKey extends Narrowable = string> {
  type: 'group'
  gridSize?: number | string
  fields: Array<
    Omit<_BaseField<FieldKey>, 'label'> &
    (
      | TextField
      | PasswordField
      | SelectField
      | NumberField
      | TimeField
      | DateField
      | TreeSelectField
      | CascaderField
      | ColorPickerField
    )
  >
}

export interface ObjectFieldParams {
  frameless?: boolean
}

export interface ObjectField<FieldKey extends Narrowable = string> {
  type: 'object'
  extraProperties?: boolean
  gridSize?: number | string
  fields: FormField<FieldKey>[]
  collapsible?: boolean
  collapsed?: boolean
  fieldParam?:
  | ObjectFieldParams
  | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => ObjectFieldParams)
}

export interface _ArrayField<FieldKey extends Narrowable = string> {
  extraProperties?: boolean
  gridSize?: number | string
  fields: FormField<FieldKey>[]
  collapsible?: boolean
  collapsed?: boolean
  headerTemplate?: (item: Record<string, any>, index: number) => string
  actions?: {
    [key in 'deleteItem' | 'moveUp' | 'moveDown']?:
    | boolean
    | ((
      value: Record<string, unknown>,
      dependencies: Record<string, unknown>,
      index: number
    ) => boolean);
  } & {
    addItem?:
    | boolean
    | ((
      values: Array<Record<string, unknown>>,
      dependencies: Record<string, unknown>
    ) => boolean)
    custom?: Array<{
      label: string
      icon: string
      condition?: (
        value: Record<string, unknown>,
        dependencies: Record<string, unknown>
      ) => boolean
      action: (rowApi: ArrayCustomActionApi) => void
    }>
  }
}

export interface ArrayCustomActionApi {
  index: number
  value: Record<string, unknown>
  dependencies: Record<string, unknown>
  getValue(key: string): unknown
  setValue(key: string, value: unknown): void
  getOptions: FieldApi['getOptions']
}

export type ArrayVariantField<FieldKey extends Narrowable = string> = Omit<
  _ArrayField<FieldKey>,
  'fields'
> & {
  type: 'array-variant'
  variantKey: string
  variants: Array<{
    label: string | (() => VNodeChild)
    key: string | number
    fields: FormField<FieldKey>[]
  }>
} & (
  | {
    displayMode: 'tabs'
  }
  | {
    displayMode: 'list'
    listGridSize?: number | string
    listItemSize?: number | string
    compact?: boolean
  }
)

export interface ArrayListField<FieldKey extends Narrowable = string>
  extends _ArrayField<FieldKey> {
  type: 'array-list'
  listGridSize?: number | string
  listItemSize?: number | string
  compact?: boolean
}

export interface ArrayTabsField<FieldKey extends Narrowable = string>
  extends _ArrayField<FieldKey> {
  type: 'array-tabs'
}

export interface InfoField {
  type: 'info'
  content: (dependencies: Dependencies, api: FieldApi) => VNodeChild | string
}

export interface CustomField {
  type: 'custom-component'
  component: Component
  fieldParams?:
  | Record<string, unknown>
  | ((
    deps: Dependencies,
    fieldApi: ReadonlyFieldApi
  ) => Record<string, unknown>)
  collapsible?: boolean
  collapsed?: boolean
}

export type FieldDescription = {
  title: string | (() => VNodeChild)
  content: string | (() => VNodeChild)
}

export type FieldApi = {
  getValue<T = unknown>(key: string): T
  setValue(key: string, value: unknown): void
  setValue(value: unknown): void
  getOptions<
    T extends
    | SelectOption
    | TreeSelectOption
    | CascaderOption
    | string
    | number = SelectOption | TreeSelectOption | CascaderOption,
    O = T extends string | number ? { label: string; value: T } : T,
  >(
    key?: string
  ): O[]
}

export type ReadonlyFieldApi = {
  getValue: FieldApi['getValue']
  getOptions: FieldApi['getOptions']
}

export type _BaseField<FieldKey extends Narrowable = string> = {
  label?: string | ((dependencies: Dependencies) => VNodeChild | string)
  key: FieldKey
  placeholder?: string | (() => string)
  dependencies?: (string | [string, string])[]
  required?:
  | boolean
  | ((dependencies: Dependencies, api: ReadonlyFieldApi) => boolean)
  size?: number | string
  gridSize?: number | string
  default?: unknown
  fields?: FormField<FieldKey>[]
  conditionEffect?: 'disable' | 'hide'
  labelPosition?: 'left' | 'top'
  description?: string | (() => VNodeChild) | FieldDescription
  fieldParams?:
  | Record<string, unknown>
  | ((deps: Dependencies, api: ReadonlyFieldApi) => Record<string, unknown>)
  condition?: (
    dependencies: Dependencies,
    api: ReadonlyFieldApi
  ) => Promise<boolean> | boolean
  preformat?: (value: any) => unknown
  transform?: (value: any) => unknown
  validators?:
  | ((dependencies: Dependencies, api: ReadonlyFieldApi) => ValidationArgs)
  | ValidationArgs
  watchOptions?: { deep?: boolean; immediate?: boolean }
  watch?: (value: any, params: FieldApi) => void
  onDependencyChange?: (dependencies: Dependencies, api: FieldApi) => void
  ignore?: boolean
}

export type FormField<FieldKey extends Narrowable = string> =
  _BaseField<FieldKey> &
  (
    | TextField
    | TextAreaField
    | PasswordField
    | SelectField
    | NumberField
    | ColorPickerField
    | SliderField
    | SwitchField
    | RadioField
    | CheckboxField
    | CheckboxGroupField
    | TimeField
    | DateField
    | ObjectField<FieldKey>
    | ArrayListField<FieldKey>
    | ArrayTabsField<FieldKey>
    | InfoField
    | CustomField
    | TreeSelectField
    | CascaderField
    | RatingField
    | TagField
    | UploadField
    | GroupField<FieldKey>
    | ArrayVariantField<FieldKey>
  )

export type FieldContext = ReturnType<typeof useFieldContext>

export type FieldComponentProps = {
  modelValue: unknown
  field: FormField
  context: FieldContext
  parentDisabled: boolean
  validator: Validation
  collapsed: boolean
  indent?: number
  parentKey: string[]
  disabled: boolean
  size?: string
  groupLength?: number
  group?: boolean
}

export type FieldComponentEmits = {
  (e: 'update:modelValue', value: unknown): void
}
