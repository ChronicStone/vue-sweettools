<script setup lang="ts">
import { FormSchema } from "@/types/form/form";
import { NCard, NScrollbar } from "naive-ui";

const props = defineProps<{ schema: FormSchema }>();
const emit = defineEmits<{ (e: "close"): void }>();

const formStyles = useFormStyles();
const formOverlay = ref<HTMLElement>();
const formOverlayId = generateUUID();

const globalConfig = useGlobalConfig(props.schema);

function handleOverlayClick(event: MouseEvent) {
  if (!globalConfig.getProp("uiConfig.allowOutsideClick")) return;
  if ((event.target as HTMLElement)?.id !== formOverlayId) return;
  emit("close");
}
</script>

<template>
  <Transition name="fade" appear>
    <div
      :id="formOverlayId"
      ref="formOverlay"
      class="fixed left-0 top-0 bg-black/40 grid place-items-center w-full h-screen"
      @click="handleOverlayClick"
    >
      <Transition name="scale" appear>
        <NCard
          :style="{ maxWidth: formStyles.maxWidth.value, width: '100%' }"
          class="transition-all opacity-100 fixed w-9/10 md:w-3/4 lg:w-1/2 rounded-lg h-auto"
          :content-style="{
            height: 'fit-content',
            maxHeight: formStyles.maxHeight.value,
            width: '100%',
            padding: '10px',
            display: 'relative',
          }"
          :header-style="{
            paddingTop: '25px',
          }"
        >
          <template #header>
            <div class="flex flex-col gap-4">
              <slot name="title" />
              <slot name="stepper" />
            </div>
          </template>

          <div
            v-if="globalConfig.getProp('uiConfig.showCloseButton')"
            class="absolute top-2 right-2 h-5 w-5 rounded-full cursor-pointer grid place-items-center hover:(bg-gray-500 bg-opacity-20 text-red-500)"
            @click="emit('close')"
          >
            <mdi:close class="h-4 w-4" />
          </div>

          <NScrollbar
            style="max-height: 55vh; width: 100%"
            class="max-h-55vh px-6 text-left"
          >
            <div
              class="w-full h-full pb-4 grid gap-4"
              :style="`height:fit-content !important;${formStyles.gridSize.value}`"
            >
              <slot name="fields" />
            </div>
          </NScrollbar>

          <template #footer>
            <div
              class="flex w-full h-[fit-content] justify-end items-center gap-4 pt-6"
            >
              <slot name="actions" />
            </div>
          </template>
        </NCard>
      </Transition>
    </div>
  </Transition>
</template>

<style>
.scale-move,
.scale-enter-active,
.scale-leave-active {
  transition: all ease-in-out 0.15s;
}

.scale-leave-active {
  position: absolute;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.005s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
