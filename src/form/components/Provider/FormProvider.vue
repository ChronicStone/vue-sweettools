<script setup lang="ts">
import { NDialogProvider, NMessageProvider } from 'naive-ui'
import type { FormInstance } from '@/form/types/instance'
import type { Narrowable } from '@/_shared/types/utils'
import type { FormInferredData, FormSchema } from '@/form/types/form'

const formInstances = ref<FormInstance[]>([])
const showModalOverlay = ref<boolean>(false)
const modalOverlayRef = ref<HTMLElement>()

const FORM_API = {
  createForm,
  destroyAll: () => (formInstances.value = []),
  formInstances: computed(() => formInstances.value),
} as const

defineExpose(FORM_API)
provide(FORM_INJECTION_KEY, FORM_API)
provide(MODAL_OVERLAY_INJECTION_KEY, {
  modalOverlayRef,
  show: () => (showModalOverlay.value = true),
  hide: () => (showModalOverlay.value = false),
  toggle: () => (showModalOverlay.value = !showModalOverlay.value),
})

function createForm<
  TFormSchema extends FormSchema<StepKey, FieldKey>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable,
>(
  formSchema: TFormSchema,
  inputData?: Record<string, unknown>,
): Promise<{
  isCompleted: boolean
  formData: FormInferredData<TFormSchema, StepKey, FieldKey>
}> {
  const _id = generateUUID()
  return new Promise((resolve) => {
    formInstances.value.push({
      _id,
      formSchema,
      formData: inputData ?? {},
      _resolve: (isCompleted: boolean, formData: Record<string, unknown>) => {
        closeForm(_id)
        resolve({
          isCompleted,
          formData: formData as unknown as FormInferredData<
            TFormSchema,
            StepKey,
            FieldKey
          >,
        })
      },
    })
  })
}

function closeForm(id: string) {
  formInstances.value = formInstances.value.filter(
    instance => instance._id !== id,
  )
}
</script>

<template>
  <NDialogProvider>
    <NMessageProvider>
      <slot />

      <div
        v-if="formInstances.length"
        id="sweetforms__overlay"
        style="z-index: 1000"
        class="fixed left-0 top-0 grid place-items-center w-full h-screen"
      >
        <FormRenderer
          v-for="formInstance in formInstances"
          :key="formInstance._id"
          :schema="formInstance.formSchema"
          :data="formInstance.formData"
          :_resolve="formInstance._resolve"
          :modal-mode="true"
          @close-form="closeForm(formInstance._id)"
        />
      </div>
      <div
        v-show="showModalOverlay"
        id="sweetforms__modalContainer"
        ref="modalOverlayRef"
        style="z-index: 2000"
        class="absolute top-0 left-0 h-screen w-full"
        @click="showModalOverlay = false"
      />
    </NMessageProvider>
  </NDialogProvider>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}
</style>
