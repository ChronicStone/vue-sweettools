<script setup lang="ts">
import { NCard, NCheckbox, NCheckboxGroup, NDivider, NInput, NList, NListItem, NPopover, NRadio, NRadioGroup, NSpin } from 'naive-ui'
import type { QuickFilter, QuickFilterObject, QuickFilterOptions, QuickFilterPrimitive } from '@/data-list/types/shared'

const emit = defineEmits<{ (e: 'update:value', value: QuickFilterPrimitive[] | QuickFilterPrimitive): void }>()
const { label, value, options } = definePropsRefs<{
  type: QuickFilter['type']
  value: QuickFilterPrimitive[] | QuickFilterPrimitive | undefined
  label: string
  options: QuickFilterOptions
  multiple?: boolean
}>()

const searchQuery = ref<string>('')
const searchQueryRef = ref<InstanceType<typeof NInput>>()

const fieldValue = computed({
  get: () => value.value,
  set: value => emit('update:value', value),
})

const { state: resolvedOptions, isLoading } = useAsyncState(
  async () => {
    const _options = typeof options.value === 'function' ? await options.value() : options.value
    return _options.map((o) => {
      if (typeof o === 'object' && o)
        return o
      return { label: o, value: o }
    }) as QuickFilterObject[]
  },
  [],
)

const computedOptions = computed(() => {
  return resolvedOptions.value.filter(item =>
    item.value?.toString().toLowerCase().includes(searchQuery.value?.toString().toLowerCase())
  || item.label?.toString().toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function removeValue(index: number) {
  if (!Array.isArray(value.value))
    return
  value.value?.splice(index, 1)
}

function updateValue(value: QuickFilterPrimitive[]) {
  fieldValue.value = value
}

function getValueLabel(value: QuickFilterPrimitive) {
  return computedOptions.value.find(o => o.value === value)?.label ?? value
}

async function focusSearch() {
  await nextTick()
  searchQueryRef.value?.focus()
}
</script>

<template>
  <NPopover
    v-if="type === 'select-list'"
    :options="options"
    size="small" multiple
    :show-arrow="false"
    class="!p-0"
    placement="bottom-start"
    :on-update:show="focusSearch"
  >
    <template #trigger>
      <NButton size="small" dashed>
        <div class="flex items-center gap-2">
          <span class="iconify" data-icon="mdi:plus-circle-outline" />
          <span>
            <component :is="renderVNode(label)" />
          </span>

          <template v-if="!multiple && typeof fieldValue !== 'undefined'">
            <NDivider vertical class="!m-0" />
            <NTag :bordered="false" closable :on-close="() => fieldValue = undefined" size="small">
              <component :is="renderVNode(getValueLabel(fieldValue as string))" />
            </NTag>
          </template>

          <template v-if="multiple && Array.isArray(fieldValue) && fieldValue.length">
            <NDivider vertical class="!m-0" />
            <NTag
              v-for="(item, index) in fieldValue.slice(0, 3)"
              :key="index" size="small"
              closable
              :bordered="false"
              :on-close="() => removeValue(index)"
            >
              <component :is="renderVNode(getValueLabel(item))" />
            </NTag>

            <NPopover v-if="fieldValue.length > 3" trigger="hover" placement="bottom-start">
              <template #trigger>
                <NTag size="small">
                  + {{ fieldValue.length - 3 }}
                </NTag>
              </template>

              <div class="flex flex-wrap gap-2 max-w-30">
                <NTag v-for="(item, index) in fieldValue.slice(3)" :key="index" size="small" closable :on-close="() => removeValue(index)">
                  <component :is="renderVNode(getValueLabel(item))" />
                </NTag>
              </div>
            </NPopover>
          </template>
        </div>
      </NButton>
    </template>

    <NCard
      content-class="flex flex-col gap-2"
      content-style="padding: 0;"
      header-style="padding: 0;"
      footer-style="padding: 4px;"
      segmented
    >
      <template #header>
        <div class="popselect-popover-content">
          <NInput ref="searchQueryRef" v-model:value="searchQuery" size="small" placeholder="Search..." clearable>
            <template #prefix>
              <span class="iconify" data-icon="mdi:magnify" />
            </template>

            <template #placeholder />
          </NInput>
        </div>
      </template>

      <NSpin v-if="isLoading">
        <div class="h-20 grid place-items-center w-full" />
      </NSpin>

      <div v-else-if="computedOptions.length === 0" class="h-20 grid place-items-center">
        <NEmpty />
      </div>

      <NScrollbar v-else class="max-h-60">
        <component :is="multiple ? NCheckboxGroup : NRadioGroup" :value="(fieldValue as any)" class="w-full h-full" :on-update:value="(v: any) => updateValue(v)">
          <NList hoverable clickable size="small">
            <NListItem v-for="(item, index) in computedOptions" :key="index" style="padding: 0 !important" class="!p-2">
              <component :is="multiple ? NCheckbox : NRadio" :value="(item.value as any)" class="w-full h-full p-2">
                {{ item.label }}
              </component>
            </NListItem>
          </NList>
        </component>
      </NScrollbar>

      <template #footer>
        <NButton class="w-full" size="small" quaternary :disabled="multiple ? !(fieldValue as any)?.length : !fieldValue" @click="fieldValue = (multiple ? [] : undefined)">
          {{ $t("datatable.filtersPanelResetButton") }}
        </NButton>
      </template>
    </NCard>
  </NPopover>

  <ButtonToggle
    v-else-if="type === 'toggle-list'"
    v-model="fieldValue"
    :options="computedOptions"
    size="small"
    :multiple="multiple ?? false"
  />
</template>

<style scoped>
.popselect-popover-content :deep(.n-input) {
    background :transparent !important;
    --n-border: none !important;
    --n-border-focus: none !important;
    --n-border-hover: none !important;
    --n-box-shadow-focus: none !important;
}
</style>
