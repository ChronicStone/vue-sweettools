/* eslint-disable ts/ban-types */
import type { ComputedRef, DefineComponent } from 'vue'
import type { FieldComponentEmits, FieldComponentProps, FormField } from '../types/fields'
import { FieldTypes } from '../types/fields'
import ArrayListField from '@/form/components/Field/ArrayListField.vue'
import ArrayTabField from '@/form/components/Field/ArrayTabField.vue'
import ObjectField from '@/form/components/Field/ObjectField.vue'
import SelectField from '@/form/components/Field/SelectField.vue'
import TextField from '@/form/components/Field/TextField.vue'
import TagField from '@/form/components/Field/TagField.vue'
import NumberField from '@/form/components/Field/NumberField.vue'
import CascaderField from '@/form/components/Field/CascaderField.vue'
import TreeSelectField from '@/form/components/Field/TreeSelectField.vue'
import DateField from '@/form/components/Field/DateField.vue'
import TimeField from '@/form/components/Field/TimeField.vue'
import SliderField from '@/form/components/Field/SliderField.vue'
import RatingField from '@/form/components/Field/RatingField.vue'
import CheckboxField from '@/form/components/Field/CheckboxField.vue'
import CheckboxGroupField from '@/form/components/Field/CheckboxGroupField.vue'
import InfoField from '@/form/components/Field/InfoField.vue'
import CustomField from '@/form/components/Field/CustomField.vue'
import RadioField from '@/form/components/Field/RadioField.vue'
import GroupField from '@/form/components/Field/GroupField.vue'
import ColorPickerField from '@/form/components/Field/ColorPickerField.vue'
import UploadField from '@/form/components/Field/UploadField.vue'

export function useFieldComponent(field: ComputedRef<FormField>) {
  const FieldComponent = computed(() => {
    switch (field.value.type) {
      case FieldTypes.TEXT:
      case FieldTypes.TEXTAREA:
      case FieldTypes.PASSWORD:
        return TextField
      case FieldTypes.SELECT:
        return SelectField
      case FieldTypes.CASCADER:
        return CascaderField
      case FieldTypes.TREE_SELECT:
        return TreeSelectField
      case FieldTypes.TAG:
        return TagField
      case FieldTypes.NUMBER:
        return NumberField
      case FieldTypes.COLOR_PICKER:
        return ColorPickerField
      case FieldTypes.DATE:
      case FieldTypes.DATE_RANGE:
      case FieldTypes.DATE_TIME_RANGE:
      case FieldTypes.DATE_TIME:
      case FieldTypes.YEAR:
      case FieldTypes.MONTH:
      case FieldTypes.MONTH_RANGE:
        return DateField
      case FieldTypes.TIME:
        return TimeField
      case FieldTypes.SLIDER:
        return SliderField
      case FieldTypes.RATING:
        return RatingField
      case FieldTypes.CHECKBOX:
        return CheckboxField
      case FieldTypes.CHECKBOX_GROUP:
        return CheckboxGroupField
      case FieldTypes.INFO:
        return InfoField
      case FieldTypes.OBJECT:
        return ObjectField
      case FieldTypes.ARRAY_LIST:
        return ArrayListField
      case FieldTypes.ARRAY_TABS:
        return ArrayTabField
      case FieldTypes.ARRAY_VARIANT:
        return (field.value?.displayMode ?? 'tabs') === 'tabs'
          ? ArrayTabField
          : ArrayListField
      case FieldTypes.CUSTOM_COMPONENT:
        return CustomField
      case FieldTypes.RADIO:
        return RadioField
      case FieldTypes.GROUP:
        return GroupField
      case FieldTypes.UPLOAD:
        return UploadField
      default:
        return TextField
    }
  })

  return FieldComponent as unknown as DefineComponent<
    FieldComponentProps,
    {},
    {},
    {},
    {},
    {},
    {},
    Record<string, FieldComponentEmits>
  >
}
