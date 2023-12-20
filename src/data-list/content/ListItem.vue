<script setup lang="tsx">
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
import tiny from 'tinycolor2'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'
import type { ComputedRef } from 'vue'
import type { DataApi, RowAction } from '../types/shared'
import type { DataListSchema } from '../types/datalist'
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
  content,
  expandedContent,
  expandable,
  selected,
  rowActions,
  enableSelection,
  selectAll,
  listApi,
} = definePropsRefs<{
  data: GenericObject
  content: DataListSchema['content']
  expandedContent?: DataListSchema['expandedContent']
  expandable?: DataListSchema['expandable']
  rowActions: RowAction<GenericObject>[]
  enableSelection: boolean
  selectAll: boolean
  selected: boolean
  listApi: DataApi
}>()

const collapsed = ref<boolean>(true)
const { permissionValidator } = useGlobalConfig()
const _actions = computed(() =>
  rowActions.value
    .map(action => ({
      ...(action.icon && { icon: renderIcon(typeof action.icon === 'function' ? action.icon({ rowData: data.value }) : action.icon) }),
      label: action.link
        ? () => (
          <RouterLink to={action.link as RouteLocationRaw}>
            {action.label}
          </RouterLink>
          )
        : action.label,
      key: generateUUID(),
      props: {
        onClick: () =>
          action?.action?.({
            rowData: data.value,
            tableApi: listApi.value,
          }),
      },
      _enable: computed(() =>
        typeof action.condition === 'function'
          ? action.condition({
            rowData: data.value,
            tableApi: listApi.value,
          })
          : true,
      ),
      _allowed: computed(() =>
        action?.permissions?.length
          ? permissionValidator.value(action.permissions)
          : true,
      ),
    }))
    .filter(action => action._enable.value && action._allowed.value),
)

function handleSelection(event: MouseEvent, value: boolean) {
  if (selectAll.value)
    return
  emit('update:selected', value, event.shiftKey)
}

const buttonGridSize = computed(() => {
  return !_actions.value.length && (expandedContent && (expandable.value ? expandable.value({ rowData: data.value }) : true)) ? 2 : 1
})
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
      <div class="flex flex-col !md:flex-row gap-4 items-center">
        <!-- LEFT CONTAINER -->
        <template v-if="enableSelection">
          <NCheckbox
            :class="selectAll && 'cursor-not-allowed'"
            :checked="selected || selectAll"
            @click.prevent="handleSelection($event, !selected)"
          />
          <NDivider v-if="!isSmallScreen" vertical class="!m-0" />
        </template>

        <component :is="renderVNode(content, { rowData: data, tableApi: listApi })" />

        <!-- RIGHT CONTAINER -->
        <div
          v-if="expandedContent || _actions.length"
          class="grid !md:flex items-center gap-2 w-full !md:(w-auto ml-auto)"
          :style="{
            gridTemplateColumns: `repeat(${buttonGridSize}, minmax(0, 1fr))`,
          }"
        >
          <NDivider v-if="!isSmallScreen" vertical class="!m-0" />
          <NButton
            v-if="expandedContent && (expandable ? expandable({ rowData: data }) : true)"
            class="w-full !md:w-auto col-span-1"
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
          <NDropdown v-if="_actions.length" :options="_actions">
            <NButton
              :size="isSmallScreen ? 'medium' : 'small'"
              class="col-span-1 w-full !md:w-auto"
              secondary
            >
              <template #icon>
                <mdi:dots-horizontal />
              </template>
            </NButton>
          </NDropdown>
        </div>
      </div>

      <NCollapseTransition v-if="expandedContent && (expandable?.({ rowData: data }) ?? true)" :show="!collapsed">
        <div class="w-full h-auto pt-4 flex flex-col gap-4">
          <NDivider class="!m-0" />
          <Component :is="renderVNode(expandedContent, { rowData: data, tableApi: listApi })" />
        </div>
      </NCollapseTransition>
    </div>
  </NCard>
</template>
