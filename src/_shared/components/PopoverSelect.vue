<script setup lang="ts">
import { NCheckbox, NCheckboxGroup, NInput, NRadio, NRadioGroup } from 'naive-ui'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import type { QuickFilterObject, QuickFilterPrimitive } from '@/data-list/types/shared'

const props = defineProps<{
  label: string
  options: QuickFilterObject[]
  itemWidth?: number
  multiple?: boolean
  size?: 'small' | 'medium' | 'large'
  isLoading?: boolean
}>()
const { modelValue } = defineModels<{ modelValue: QuickFilterPrimitive | QuickFilterPrimitive[] }>()

const searchQuery = ref<string>('')
const searchQueryRef = ref<InstanceType<typeof NInput>>()

const computedOptions = computed(() =>
  props.options.filter(o => !searchQuery.value
  || o.label?.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
  || o.value?.toString().toLowerCase().includes(searchQuery.value.toLowerCase())),
)

async function focusSearch() {
  await nextTick()
  searchQueryRef.value?.focus()
}

function getValueLabel(value: QuickFilterPrimitive) {
  return computedOptions.value.find(o => o.value === value)?.label ?? value
}

function removeValue(index: number) {
  if (!Array.isArray(modelValue.value))
    return
  modelValue.value?.splice(index, 1)
}

function updateValue(value: QuickFilterPrimitive[]) {
  modelValue.value = value
}
</script>

<template>
  <NPopover
    :options="computedOptions"
    size="small" multiple
    :show-arrow="false"
    class="!p-0"
    placement="bottom-start"
    :on-update:show="focusSearch"
    trigger="click"
  >
    <template #trigger>
      <NButton size="small" dashed>
        <div class="flex items-center gap-2">
          <span class="iconify" data-icon="mdi:plus-circle-outline" />
          <span>
            <component :is="renderVNode(label)" />
          </span>

          <template v-if="!multiple && typeof modelValue !== 'undefined'">
            <NDivider vertical class="!m-0" />
            <NTag :bordered="false" closable :on-close="() => modelValue = undefined" size="small">
              <component :is="renderVNode(getValueLabel(modelValue as string))" />
            </NTag>
          </template>

          <template v-if="isLoading">
            <NDivider vertical class="!m-0" />
            <NSpin :size="10" />
          </template>

          <template v-if="multiple && Array.isArray(modelValue) && modelValue.length">
            <NDivider vertical class="!m-0" />
            <div v-auto-animate class="flex  gap-2">
              <NTag
                v-for="(item, index) in modelValue.slice(0, 3)"
                :key="index" size="small"
                closable
                :bordered="false"
                :on-close="() => removeValue(index)"
              >
                <component :is="renderVNode(getValueLabel(item))" />
              </NTag>

              <NPopover v-if="modelValue.length > 3" trigger="hover" placement="bottom-start">
                <template #trigger>
                  <NTag size="small">
                    + {{ modelValue.length - 3 }}
                  </NTag>
                </template>

                <div class="flex flex-wrap gap-2 max-w-30">
                  <NTag v-for="(item, index) in modelValue.slice(3)" :key="index" size="small" closable :on-close="() => removeValue(index)">
                    <component :is="renderVNode(getValueLabel(item))" />
                  </NTag>
                </div>
              </NPopover>
            </div>
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
        <component :is="multiple ? NCheckboxGroup : NRadioGroup" :value="(modelValue as any)" class="w-full h-full" :on-update:value="(v: any) => updateValue(v)">
          <NList hoverable clickable size="small">
            <div v-auto-animate>
              <NListItem v-for="(item, index) in computedOptions" :key="index" style="padding: 0 !important" class="!p-2">
                <component :is="multiple ? NCheckbox : NRadio" :value="(item.value as any)" class="w-full h-full p-2">
                  {{ item.label }}
                </component>
              </NListItem>
            </div>
          </NList>
        </component>
      </NScrollbar>

      <template #footer>
        <NButton class="w-full" size="small" quaternary :disabled="multiple ? !(modelValue as any)?.length : !modelValue" @click="modelValue = (multiple ? [] : undefined)">
          {{ $t("datatable.filtersPanelResetButton") }}
        </NButton>
      </template>
    </NCard>
  </NPopover>
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
