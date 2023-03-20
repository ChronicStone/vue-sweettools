import {
  FieldTypes,
  FormField,
  FieldComponentProps,
  FieldComponentEmits,
} from "@/types/form/fields";
import { ComputedRef, DefineComponent } from "vue";
import ArrayListField from "@/components/Form/Field/ArrayListField.vue";
import ArrayTabField from "@/components/Form/Field/ArrayTabField.vue";
import ObjectField from "@/components/Form/Field/ObjectField.vue";
import SelectField from "@/components/Form/Field/SelectField.vue";
import TextField from "@/components/Form/Field/TextField.vue";
import TagField from "@/components/Form/Field/TagField.vue";
import NumberField from "@/components/Form/Field/NumberField.vue";
import CascaderField from "@/components/Form/Field/CascaderField.vue";
import TreeSelectField from "@/components/Form/Field/TreeSelectField.vue";
import DateField from "@/components/Form/Field/DateField.vue";
import TimeField from "@/components/Form/Field/TimeField.vue";
import SliderField from "@/components/Form/Field/SliderField.vue";
import RatingField from "@/components/Form/Field/RatingField.vue";
import CheckboxField from "@/components/Form/Field/CheckboxField.vue";
import CheckboxGroupField from "@/components/Form/Field/CheckboxGroupField.vue";
import InfoField from "@/components/Form/Field/InfoField.vue";
import CustomField from "@/components/Form/Field/CustomField.vue";
import RadioField from "@/components/Form/Field/RadioField.vue";
import GroupField from "@/components/Form/Field/GroupField.vue";

export function useFieldComponent(field: ComputedRef<FormField>) {
  const FieldComponent = computed(() => {
    switch (field.value.type) {
      case FieldTypes.TEXT:
      case FieldTypes.TEXTAREA:
      case FieldTypes.PASSWORD:
        return TextField;
      case FieldTypes.SELECT:
        return SelectField;
      case FieldTypes.CASCADER:
        return CascaderField;
      case FieldTypes.TREE_SELECT:
        return TreeSelectField;
      case FieldTypes.TAG:
        return TagField;
      case FieldTypes.NUMBER:
        return NumberField;
      case FieldTypes.DATE:
      case FieldTypes.DATE_RANGE:
      case FieldTypes.DATE_TIME_RANGE:
      case FieldTypes.DATE_TIME:
      case FieldTypes.YEAR:
      case FieldTypes.MONTH:
        return DateField;
      case FieldTypes.TIME:
        return TimeField;
      case FieldTypes.SLIDER:
        return SliderField;
      case FieldTypes.RATING:
        return RatingField;
      case FieldTypes.CHECKBOX:
        return CheckboxField;
      case FieldTypes.CHECKBOX_GROUP:
        return CheckboxGroupField;
      case FieldTypes.INFO:
        return InfoField;
      case FieldTypes.OBJECT:
        return ObjectField;
      case FieldTypes.ARRAY_LIST:
        return ArrayListField;
      case FieldTypes.ARRAY_TABS:
        return ArrayTabField;
      case FieldTypes.CUSTOM_COMPONENT:
        return CustomField;
      case FieldTypes.RADIO:
        return RadioField;
      case FieldTypes.GROUP:
        return GroupField;
      default:
        return TextField;
    }
  });

  /* eslint-disable @typescript-eslint/ban-types */
  return FieldComponent as unknown as DefineComponent<
    FieldComponentProps,
    {},
    {},
    {},
    {},
    {},
    {},
    Record<string, FieldComponentEmits>
  >;
}
