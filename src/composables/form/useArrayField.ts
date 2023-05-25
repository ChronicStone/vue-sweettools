import { ArrayListField, ArrayTabsField } from "@/types/form/fields";
import { mapFieldsInitialState } from "@/utils/form/mapFieldsInitialState";
import { TabsInst, useDialog } from "naive-ui";
import { ComputedRef, Ref, WritableComputedRef } from "vue";

export function useArrayField(
  field: ComputedRef<ArrayListField | ArrayTabsField>,
  fieldValue: WritableComputedRef<Array<Record<string, any>>>,
  activeTab?: Ref<number>,
  tabsRef?: Ref<TabsInst | undefined>
) {
  const dialogApi = useDialog();

  async function addItem() {
    const value = mapFieldsInitialState({}, field.value.fields, {});
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

  return {
    addItem,
    removeItem,
    moveItem,
  };
}
