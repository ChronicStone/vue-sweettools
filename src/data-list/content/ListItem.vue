<script setup lang="ts">
import type {
  GlobalThemeOverrides,
} from 'naive-ui'
import {
  NButton,
  NCard,
  NCheckbox,
  NCollapseTransition,
  NDivider,
  NDropdown,
  useThemeVars,
} from 'naive-ui'
import type { VNodeChild } from 'vue'
import tiny from 'tinycolor2'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import type { RowAction } from '../types/shared'
import type { GenericObject } from '@/_shared/types/utils'

const emit = defineEmits<{
  'update:selected': [value: boolean, range: boolean]
}>()

const parentConfigScope = inject<{
  mergedThemeOverridesRef: ComputedRef<GlobalThemeOverrides>
  mergedThemeRef: ComputedRef<BuiltInGlobalTheme | null>
}>('n-config-provider')

const isDark = computed(
  () => parentConfigScope?.mergedThemeRef.value?.name === 'dark',
)

const themeVars = useThemeVars()
const isSmallScreen = useBreakpointStyle('true md:false', 'boolean')

const {
  data,
  image,
  title,
  description,
  subtitle,
  expandedContent,
  // expendable,
  selected,
  rowActions,
  enableSelection,
  selectAll,
} = definePropsRefs<{
  data: GenericObject
  title: (params: { rowData: GenericObject }) => VNodeChild
  subtitle?: (params: { rowData: GenericObject }) => VNodeChild
  image?: (params: { rowData: GenericObject }) => VNodeChild
  description?: (params: { rowData: GenericObject }) => VNodeChild
  expandedContent?: (params: { rowData: GenericObject }) => VNodeChild
  expendable?: (params: { rowData: GenericObject }) => boolean
  rowActions?: RowAction<GenericObject>[]
  enableSelection: boolean
  selectAll: boolean
  selected: boolean
}>()

const collapsed = ref<boolean>(true)
const actions = computed(() =>
  (rowActions.value ?? []).map((action) => {
    if ('type' in action) { return { type: 'divider', hidden: false, key: generateUUID() } }
    else {
      return {
        key: generateUUID(),
        label: action.label,
        ...(action.icon && { icon: renderIcon(typeof action.icon === 'function' ? action.icon({ rowData: data.value }) : action.icon) }),
        hidden:
          typeof action.condition === 'function'
            ? !action.condition({ rowData: data.value, tableApi: null as any })
            : false,
        props: {
          onClick: () => action?.action?.({ rowData: data.value, tableApi: null as any }),
        },
      }
    }
  }),
)

function handleSelection(event: MouseEvent, value: boolean) {
  if (selectAll.value)
    return
  emit('update:selected', value, event.shiftKey)
}
</script>

<template>
  <NCard
    embedded
    :theme-overrides="{
      colorEmbedded: tiny(themeVars.primaryColor)
        [isDark ? 'darken' : 'lighten'](isDark ? 35 : 45)
        .greyscale()
        .toHexString(),
      ...(selected || selectAll
        ? {
          borderColor: tiny(themeVars.primaryColor)
            [isDark ? 'darken' : 'lighten'](isDark ? 15 : 15)
            .toHexString(),
        }
        : {}),
    }"
  >
    <div class="flex flex-col">
      <div class="flex flex-col md:flex-row justify-between gap-4 items-center">
        <!-- LEFT CONTAINER -->
        <div
          class="flex flex-row-reverse md:flex-row gap-4 items-center w-full md:w-auto h-full"
        >
          <template v-if="enableSelection">
            <NCheckbox
              :class="selectAll && 'cursor-not-allowed'"
              :checked="selected || selectAll"
              @click.prevent="handleSelection($event, !selected)"
            />
            <NDivider v-if="!isSmallScreen" vertical class="!m-0" />
          </template>
          <template v-if="image">
            <div v-if="image" id="item__img__wrapper flex items-center h-full">
              <Component :is="renderVNode(image, { rowData: data })" />
            </div>
            <NDivider v-if="!isSmallScreen" vertical class="!m-0" />
          </template>
          <div class="flex flex-col gap-2 justify-center w-full md:w-auto">
            <div class="text-lg font-semibold">
              <Component :is="renderVNode(title, { rowData: data })" />
            </div>
            <div>
              <Component
                :is="renderVNode(subtitle, { rowData: data })"
                v-if="subtitle"
              />
            </div>
          </div>
        </div>

        <!-- RIGHT CONTAINER -->
        <div
          class="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto"
        >
          <template v-if="description">
            <div class="flex flex-col gap-4">
              <Component :is="renderVNode(description, { rowData: data })" />
            </div>
            <NDivider v-if="!isSmallScreen" vertical class="!m-0" />
          </template>
          <div
            v-if="expandedContent || actions.length"
            class="grid md:flex grid-cols-2 items-center gap-2 w-full md:w-auto"
          >
            <NButton
              v-if="expandedContent"
              class="w-full md:w-auto col-span-1"
              :size="isSmallScreen ? 'medium' : 'small'"
              secondary
              @click="collapsed = !collapsed"
            >
              <template #icon>
                <mdi:chevron-right
                  class="transform transition-all ease-in-out duration-200"
                  :class="{ 'rotate-90': !collapsed }"
                />
              </template>
            </NButton>
            <NDropdown v-if="actions.length" :options="actions">
              <NButton
                :size="isSmallScreen ? 'medium' : 'small'"
                class="col-span-1 w-full md:w-auto"
                secondary
              >
                <template #icon>
                  <mdi:dots-horizontal />
                </template>
              </NButton>
            </NDropdown>
          </div>
        </div>
      </div>

      <NCollapseTransition :show="!collapsed">
        <div class="w-full h-auto pt-4 flex flex-col gap-4">
          <NDivider class="!m-0" />
          <Component :is="renderVNode(expandedContent, { rowData: data })" />
        </div>
      </NCollapseTransition>
    </div>
  </NCard>
</template>
