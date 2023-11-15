<script setup lang="tsx">
import type { VNodeChild } from 'vue'
import { NCard, NModal, NScrollbar } from 'naive-ui'
import type { GenericObject } from '../types/utils'
import type { FieldDescription } from '@/form/types/fields'

const props = defineProps<{
  description: string | (() => VNodeChild) | FieldDescription
  fieldLabel?: string | ((dependencies: GenericObject) => VNodeChild)
}>()

const showDescription = ref<boolean>(false)
const modalOverlayApi = inject(MODAL_OVERLAY_INJECTION_KEY)

function renderLabel(
  fieldLabel: typeof props.fieldLabel,
  description: typeof props.description,
) {
  return renderVNode(
    (description as { title: string; content: string })?.title ?? fieldLabel,
  )
}

function renderContent(description: typeof props.description) {
  return renderVNode(
    preRenderStringContent(
      (description as { title: string; content: string })?.content
        ?? description,
    ),
  )
}

watch(
  () => showDescription.value,
  () => modalOverlayApi?.toggle(),
)
</script>

<template>
  <div
    class="h-5 w-5 cursor-pointer grid place-items-center"
    @click="showDescription = true"
  >
    <mdi-information class="h-3.5 w-3.5" />
  </div>
  <NModal v-model:show="showDescription">
    <NCard
      closable
      :on-close="() => (showDescription = false)"
      style="width: 600px; z-index: 30000"
      title="Modal"
      :bordered="false"
      size="huge"
    >
      <template #header>
        <Component :is="renderLabel(fieldLabel, description)" />
      </template>

      <NScrollbar style="max-height: 80vh" class="pr-6">
        <Component :is="renderContent(description)" />
      </NScrollbar>
    </NCard>
  </NModal>
</template>
