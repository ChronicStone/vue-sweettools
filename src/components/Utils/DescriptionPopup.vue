<script setup lang="tsx">
import { ref, defineProps, inject, watch, VNodeChild, PropType } from "vue";
import { NModal, NCard, NScrollbar } from "naive-ui";
import { MODAL_OVERLAY_INJECTION_KEY } from "@/config/injectionKeys";
import { renderVNode } from "@/utils/renderVNode";

const props = defineProps<{
  fieldLabel?: string;
  description: string | (() => VNodeChild) | { title: string; content: string };
}>();

const showDescription = ref<boolean>(false);
const modalOverlayApi = inject(MODAL_OVERLAY_INJECTION_KEY);

const PreRenderStringContent = (content: string | VNodeChild) =>
  typeof content === "string" ? () => <div v-html={content}></div> : content;

function renderLabel(
  fieldLabel: string | undefined,
  description: typeof props.description
) {
  return renderVNode(
    (description as { title: string; content: string })?.title ?? fieldLabel
  );
}

function renderContent(description: typeof props.description) {
  return renderVNode(
    PreRenderStringContent(
      (description as { title: string; content: string })?.content ??
        description
    )
  );
}

watch(
  () => showDescription.value,
  () => modalOverlayApi?.toggle()
);
</script>

<template>
  <div
    class="h-5 w-5 cursor-pointer grid place-items-center"
    @click="showDescription = true"
  >
    <i-mdi-information class="h-3.5 w-3.5" />
  </div>
  <NModal v-model:show="showDescription" to="#sweetforms__modalContainer">
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
