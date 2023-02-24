import { FieldInstance } from "@/types/form/instance";
const [useProviderFieldManager, useFieldManager] = createInjectionState(() => {
  const fieldInstance = ref<FieldInstance[]>([]);

  return {};
});

export { useProviderFieldManager, useFieldManager };
