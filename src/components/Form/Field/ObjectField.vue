<script setup lang="ts">
import {
  FieldComponentEmits,
  FieldComponentProps,
  ObjectField,
} from "@/types/form/fields";
import { NCard, NCollapseTransition } from "naive-ui";
import FieldRenderer from "@/components/Form/Renderer/FieldRenderer.vue";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const _field = computed(() => props.field as ObjectField);

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const formStyle = useFormStyles();
const gridSize = useBreakpointStyle(props.field.gridSize ?? "", "grid-cols");
</script>

<template>
  <NCollapseTransition v-if="field.type === 'object'" :show="!collapsed">
    <component :is="field?.fieldParams?.frameless ? 'div' : NCard">
      <div
        class="grid gap-4"
        :style="field.gridSize ? gridSize : formStyle?.gridSize.value"
      >
        <FieldRenderer
          v-for="(subfield, index) in _field.fields"
          :key="index"
          v-model="fieldValue[subfield.key]"
          :field="subfield"
        />
      </div>
    </component>
  </NCollapseTransition>
</template>
