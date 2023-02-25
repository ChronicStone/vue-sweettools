import { FieldComponentEmits } from "./../../types/form/fields";
/* eslint-disable @typescript-eslint/ban-types */
import { FieldComponentProps } from "./../../types/form/fields";
import { ComputedRef, DefineComponent, EmitsOptions } from "vue";
import ArrayListField from "@/components/Form/Field/ArrayListField.vue";
import ArrayTabField from "@/components/Form/Field/ArrayTabField.vue";
import ObjectField from "@/components/Form/Field/ObjectField.vue";
import SelectField from "@/components/Form/Field/SelectField.vue";
import TextField from "@/components/Form/Field/TextField.vue";
import {
  FieldTypes,
  FormField,
  ArrayField as TArrayField,
} from "@/types/form/fields";

export function useFieldComponent(field: ComputedRef<FormField>) {
  const FieldComponent = computed(() => {
    switch (field.value.type) {
      case FieldTypes.TEXT:
      case FieldTypes.TEXTAREA:
      case FieldTypes.PASSWORD:
        return TextField;
      case FieldTypes.SELECT:
        return SelectField;
      case FieldTypes.OBJECT:
        return ObjectField;
      case FieldTypes.ARRAY:
        if ((field.value as TArrayField).format === "tabs")
          return ArrayTabField;
        if ((field.value as TArrayField).format === "list")
          return ArrayListField;
        return ArrayTabField;
      default:
        return TextField;
    }
  });

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
