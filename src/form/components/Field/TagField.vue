<script setup lang="tsx">
import { NDynamicTags, NTag } from 'naive-ui'
import { useDraggable } from 'vue-draggable-plus'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const fieldValue = computed({
  get: () => props.modelValue as string[] | undefined,
  set: value => emit('update:modelValue', value),
})

function removeTag(index: number) {
  fieldValue.value?.splice(index, 1)
}

const draggable = computed(() => props.context.rawInputProps.value.draggable ?? false)
const customTagRender = computed(() => props.context.inputProps.value.renderTag)
const renderTag = computed(() => (value: string, index: number) => {
  return (
    <NTag closable onClose={() => removeTag(index)}>
      <div class="flex items-center gap-1">
        { draggable.value && <span class="iconify cursor-grab drag-handle" data-icon="material-symbols:drag-indicator" /> }
        { typeof customTagRender.value === 'function' ? customTagRender.value(value, index) : value }
      </div>
    </NTag>
  )
})

const dragStarted = ref<boolean>(false)
const tagsRef = ref<InstanceType<typeof NDynamicTags>>()
const tagsContainerRef = ref<HTMLElement>()
const { start, pause, resume } = useDraggable(tagsContainerRef, ref([]), {
  immediate: false,
  animation: 150,
  handle: '.drag-handle',
  onEnd: (event) => {
    const { oldIndex, newIndex } = event
    if (oldIndex === undefined || newIndex === undefined)
      return
    const tags = fieldValue.value?.slice() ?? []
    const [removed] = tags.splice(oldIndex, 1)
    tags.splice(newIndex, 0, removed)
    fieldValue.value = tags
  },
})

watchEffect(() => {
  tagsContainerRef.value = tagsRef.value?.$el
})

watchOnce(() => tagsContainerRef.value, (el) => {
  if (el && draggable.value) {
    start()
    dragStarted.value = true
  }
})

watch(() => draggable.value, (enable) => {
  if (enable && !dragStarted.value) {
    start()
    dragStarted.value = true
  }
  else if (!enable && dragStarted.value) {
    pause()
    dragStarted.value = false
  }
  else if (enable && dragStarted.value) {
    resume()
  }
})
</script>

<template>
  <NDynamicTags
    ref="tagsRef"
    v-model:value="fieldValue"
    v-bind="{
      ...props.context.inputProps.value,
      renderTag,
    }"
    :disabled="disabled"
    @blur="validator?.$touch"
  />
</template>
