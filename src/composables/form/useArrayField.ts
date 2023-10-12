import {
  ArrayListField,
  ArrayTabsField,
  ArrayVariantField,
  FormField,
} from "@/types/form/fields";
import { mapFieldsInitialState } from "@/utils/form/mapFieldsInitialState";
import { DropdownOption, TabsInst, useDialog } from "naive-ui";
import { ComputedRef, Ref, WritableComputedRef } from "vue";

export function useArrayField(
  field: ComputedRef<ArrayListField | ArrayTabsField | ArrayVariantField>,
  fieldValue: WritableComputedRef<Array<Record<string, any>>>,
  context: ReturnType<typeof useFieldContext>,
  activeTab?: Ref<number>,
  tabsRef?: Ref<TabsInst | undefined>
) {
  const dialogApi = useDialog();
  const formApi = useFormApi();
  const { formState } = useFormState();

  function resolveVariantFields(item: Record<string, any>) {
    if (field.value.type !== "array-variant") return [];
    const variantKey = item[field.value.variantKey];
    const variant = field.value.variants.find((v) => v.key === variantKey);
    if (!variant) return [];
    return variant.fields;
  }

  async function addItem() {
    let fields: Array<FormField>;
    let value: any;
    if (field.value.type === "array-variant") {
      const { isCompleted, formData } = await formApi.createForm({
        title: "Select a variant",
        maxWidth: "500px",
        gridSize: 1,
        fieldSize: 1,
        fields: [
          {
            label: "Variant",
            key: "variant",
            type: "select",
            options: field.value.variants.map((v) => ({
              label: v.label,
              value: v.key,
            })),
          },
        ],
      });
      if (!isCompleted) return;
      const variant = field.value.variants.find(
        (v) => v.key === formData.variant
      );
      if (!variant) return;
      fields = variant.fields;
      value = {
        ...mapFieldsInitialState({}, fields, {}),
        [field.value.variantKey]: formData.variant,
      };
    } else {
      fields = field.value.fields;
      value = mapFieldsInitialState({}, fields, {});
    }

    if (!Array.isArray(fieldValue.value)) fieldValue.value = [value];
    else fieldValue.value.push(value);
    nextTick(() => {
      if (activeTab) activeTab.value = fieldValue.value?.length - 1;
      if (tabsRef) tabsRef.value?.syncBarPosition();
    });
  }

  async function removeItem(index: number) {
    const proceed = await useConfirmDialog(dialogApi, {
      title: "Confirm suppression",
      content: "Are you sure you want to delete this item?",
      type: "error",
    });
    if (!proceed) return;

    fieldValue.value.splice(index, 1);
    nextTick(() => {
      if (activeTab)
        activeTab.value =
          index - 1 <= 0
            ? 0
            : index - 1 > fieldValue.value.length - 1
            ? fieldValue.value.length - 1
            : index - 1;
      if (tabsRef) tabsRef.value?.syncBarPosition();
    });
  }

  function moveItem(index: number, direction: "left" | "right") {
    if (direction === "left") {
      [fieldValue.value[index], fieldValue.value[index - 1]] = [
        fieldValue.value?.[index - 1],
        fieldValue.value?.[index],
      ];
    } else {
      [fieldValue.value[index], fieldValue.value[index + 1]] = [
        fieldValue.value?.[index + 1],
        fieldValue.value?.[index],
      ];
    }
    if (activeTab)
      activeTab.value = direction === "left" ? index - 1 : index + 1;
    if (tabsRef) tabsRef.value?.syncBarPosition();
  }

  const customActions = computed<Array<DropdownOption[]>>(() =>
    fieldValue.value?.map((currentVal, index) =>
      (
        field.value.actions?.custom?.filter(
          (action) =>
            action?.condition?.(currentVal, context.dependencies.value) ?? true
        ) ?? []
      ).map((action) => ({
        key: generateUUID(),
        label: action.label,
        icon: renderIcon(action.icon),
        props: {
          onClick: () =>
            action.action({
              value: currentVal,
              index,
              dependencies: context.dependencies.value,
              getValue: (key: string) =>
                propertyResolver(
                  key,
                  [...context.parentKey.value, (field.value as any).key],
                  formState.value
                ),

              setValue: (key: string, value: unknown) =>
                propertySetter(
                  key,
                  [...context.parentKey.value, (field.value as any).key],
                  formState.value,
                  value
                ),
            }),
        },
      }))
    )
  );

  return {
    addItem,
    removeItem,
    moveItem,
    resolveVariantFields,
    customActions,
  };
}
