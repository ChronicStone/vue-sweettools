<script setup lang="ts">
import { NSelect } from 'naive-ui'
import type { Value } from 'naive-ui/es/select/src/interface'
import type { FieldComponentEmits, FieldComponentProps, SelectField } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()

const emit = defineEmits<FieldComponentEmits>()

const i18n = useTranslations()

const { scale } = useFormStyles()

const field = computed(() => props.field as SelectField)
const fieldValue = computed({
  get: () => props.modelValue as Value | null | undefined,
  set: value => emit('update:modelValue', value),
})

const createOptionsEnabled = computed(() => typeof field.value.createOption !== 'undefined')
const allowOptionsRefresh = computed(() => field.value?.allowOptionsRefresh ?? false)

const actionsGridSize = computed(() => [createOptionsEnabled, allowOptionsRefresh].filter(Boolean).length)
const createOptionLabel = computed(() => {
  if (typeof field.value.createOption === 'function')
    return i18n.t('form.fields.select.createOptionButton')
  else
    return field.value.createOption?.label ?? i18n.t('form.fields.select.createOptionButton')
})
</script>

<template>
  <NSelect
    v-model:value="fieldValue"
    :style="group ? { width: `${size} !important` } : {}"
    :placeholder="context.placeholder.value"
    :options="context.options.value"
    v-bind="context.inputProps.value"
    :loading="context._evalOptions.value"
    filterable
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    :size="scale"
    @blur="validator?.$touch"
  >
    <template v-if="createOptionsEnabled || allowOptionsRefresh" #action>
      <div class="grid gap-2" :class="{ 'grid-cols-2': actionsGridSize === 2, 'grid-cols-1': actionsGridSize === 1 }">
        <NButton
          v-if="createOptionsEnabled"
          quaternary
          size="small"
          class="w-full"
          :disabled="context._evalOptions.value"
          @click="context.createOption"
        >
          <template #icon>
            <span class="iconify" data-icon="mdi:plus" />
          </template>
          {{ createOptionLabel }}
        </NButton>

        <NButton
          v-if="allowOptionsRefresh"
          quaternary
          size="small"
          class="w-full"
          :disabled="context._evalOptions.value"
          @click="context.refreshOptions"
        >
          <template #icon>
            <span class="iconify" data-icon="mdi:refresh" />
          </template>
          {{ i18n.t("form.fields.select.refreshOptionsButton") }}
        </NButton>
      </div>
    </template>
  </NSelect>
</template>
