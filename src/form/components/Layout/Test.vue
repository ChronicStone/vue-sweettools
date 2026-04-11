<script setup lang="ts">
interface Props {
  index: number
}

const props = defineProps<Props>()
const currentIndex = ref(props.index)

watch(() => props.index, (newIndex) => {
  currentIndex.value = newIndex
})
</script>

<template>
  <div class="slide-group">
    <div
      class="slides-container"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <slot />
    </div>
  </div>
</template>

  <style scoped>
  .slide-group {
    overflow: hidden;
    width: 100%; /* Adjust this to fit the container size */
    height: 100%; /* Adjust this based on content */
  }

  .slides-container {
    display: flex;
    transition: transform 0.5s ease-in-out;
    width: 100%;
    height: 100%;
  }

  ::v-slotted(*) {
    flex: 0 0 100%;
    height: 100%; /* Ensure height matches .slide-group if needed */
  }
  </style>
