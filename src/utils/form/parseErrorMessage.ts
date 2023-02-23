import { FormField } from "@/types/form/fields";
import { Validation } from "@vuelidate/core";

export function parseErrorMessage($v: Validation, field: FormField) {
  if (field.type != "array")
    return $v.$errors.filter((err) => err.$validator != "$each")[0]?.$message;
  else {
    if ($v.$errors[0]?.$validator === "$each")
      return `The field ${field.label} has items with invalid properties`;
    else return $v.$errors[0]?.$message;
  }
}
