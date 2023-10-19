<script setup lang="ts">
import { type DropdownAction } from "@/composables/useDropdownActions";

const props = defineProps<{ actions: DropdownAction[] }>();

const showDropdown = ref<boolean>(false);
const _actions = useDropdownActions(computed(() => props.actions));

const xRef = ref<number>(0);
const yRef = ref<number>(0);

async function handleContextMenu(e: MouseEvent) {
  showDropdown.value = false;
  await nextTick();
  xRef.value = e.clientX;
  yRef.value = e.clientY;
  showDropdown.value = true;
}
</script>

<template>
  <div @contextmenu.prevent="handleContextMenu">
    <slot />
    <NDropdown
      placement="bottom-start"
      trigger="manual"
      :x="xRef"
      :y="yRef"
      :options="_actions"
      :show="showDropdown"
      :on-clickoutside="() => (showDropdown = false)"
      @select="() => (showDropdown = false)"
    />
  </div>
</template>
