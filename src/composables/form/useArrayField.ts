import {
  ArrayListField,
  ArrayTabsField,
  ArrayVariantField,
  FormField,
} from "@/types/form/fields";
import { mapFieldsInitialState } from "@/utils/form/mapFieldsInitialState";
import { get } from "@vueuse/core";
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
  const { formState, contextMap } = useFormState();

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
        ...mapFieldsInitialState({}, fields),
        [field.value.variantKey]: formData.variant,
      };
    } else {
      fields = field.value.fields;
      value = mapFieldsInitialState({}, fields);
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

  const baseActions = computed(() => ({
    addItem:
      typeof field.value.actions?.addItem === "function"
        ? field.value.actions.addItem(
            fieldValue.value,
            context.dependencies.value
          )
        : field.value.actions?.addItem ?? true,
    items: fieldValue.value.map((itemValue, index) =>
      (["deleteItem", "moveUp", "moveDown"] as const).reduce(
        (acc, actionKey) => ({
          ...acc,
          [actionKey]:
            field.value.actions &&
            field.value.actions[actionKey] &&
            typeof field.value.actions[actionKey] !== "undefined" &&
            typeof field.value.actions[actionKey] === "function"
              ? (field.value.actions[actionKey] as any)(
                  itemValue,
                  context.dependencies.value,
                  index
                )
              : field.value.actions?.[actionKey] ?? true,
        }),
        {} as Record<"deleteItem" | "moveUp" | "moveDown", boolean>
      )
    ),
  }));

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
              getContext: (key: string) => {
                const contextPath = getPropertyFullPath(key, [
                  ...context.parentKey.value,
                  (field.value as any).key,
                ]);
                const _context = contextMap.value.get(contextPath.join("."));
                if (!_context)
                  throw new Error(
                    `Context not found for path ${contextPath.join(".")}`
                  );
                return {
                  options: get(_context._options),
                  disabled: get(_context.disabled),
                  dependencies: get(_context.dependencies),
                  required: get(_context.required),
                };
              },
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
    baseActions,
  };
}
