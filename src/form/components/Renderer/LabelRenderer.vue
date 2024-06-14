<script setup lang="ts">
import type { GenericObject } from '@/_shared/types/utils'
import type { FormField, ObjectField } from '@/form/types/fields'

const props = defineProps<{
  field: FormField
  dependencies: GenericObject
  required: boolean
  collapsed?: boolean
  renderDescription?: boolean
  isDirty?: boolean
  resetField?: () => void
}>()
const emit = defineEmits<{ (e: 'update:collapsed', value: boolean): void }>()
const collapsed = computed({
  get: () => props.collapsed,
  set: (value: boolean) => emit('update:collapsed', value),
})

const collapsible = computed<boolean>(
  () => (props.field as ObjectField)?.collapsible ?? false,
)
</script>

<template>
  <div class="flex gap-2 items-center justify-between">
    <span
      v-if="field?.label"
      class="m-0 flex gap-2 justify-start items-center group cursor-pointer"
      style="cursor: pointer !important"
      @click="
        [
          'object',
          'array-list',
          'array-tabs',
          'custom-component',
          'array-variant',
        ].includes(field.type) && collapsible
          ? (collapsed = !collapsed)
          : null
      "
    >
      <CollapseButton
        v-if="
          [
            'object',
            'array-list',
            'array-tabs',
            'custom-component',
            'array-variant',
          ].includes(field.type)
            && (collapsible
              ?? ['object', 'array-list', 'array-tabs', 'array-variant'].includes(
                field.type,
              )
              ? true
              : false)
        "
        v-model="collapsed"
      />
      <label
        class="flex items-center transition-all ease-in-out duration-150"
        :class="{
          'cursor-pointer': [
            'object',
            'array-list',
            'array-tabs',
            'array-variant',
            'custom-component',
          ].includes(field.type) && collapsible,
        }"
        :for="field.key"
      >
        <component
          :is="renderVNode(props.field?.label ?? '', dependencies, {})"
        />
        <span v-if="field.type !== 'checkbox'" class="text-red-500 ml-1.5">
          {{ required ? "*" : "" }}
        </span>
      </label>
    </span>

    <div class="flex items-center gap-1">
      <component :is="renderVNode(props.field?.labelExtra)" v-if="field?.labelExtra" />
      <DescriptionPopup
        v-if="field.description && (renderDescription ?? true)"
        :description="field.description"
        :field-label="field.label ?? ''"
      />
      <NTooltip v-if="isDirty">
        {{ $t('form.resetField') }}
        <template #trigger>
          <NButton text size="tiny" @click="resetField">
            <template #icon>
              <mdi:reload />
            </template>
          </NButton>
        </template>
      </NTooltip>
    </div>
  </div>
</template>
