<script setup lang="ts">
import type { GenericObject } from '@/_shared/types/utils'
import type { FieldApi, FieldComponentProps, InfoField } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const _field = computed(() => props.field as InfoField)

function renderInfoContent(
  content: InfoField['content'],
  dependencies: GenericObject,
  fieldApi: FieldApi,
) {
  return renderVNode(content ?? '', dependencies, fieldApi)
}
</script>

<template>
  <component
    :is="
      renderInfoContent(
        _field.content,
        context.dependencies.value,
        context.fieldApi,
      )
    "
  />
</template>
