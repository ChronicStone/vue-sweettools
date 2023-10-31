<script setup lang="ts">
import { Validation } from "@vuelidate/core";
import {
  NUpload,
  NUploadDragger,
  NIcon,
  UploadCustomRequestOptions,
} from "naive-ui";

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void;
}>();
const props = defineProps<{
  modelValue: string | null;
  validator: Validation;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

watch(
  () => modelValue.value,
  () => props.validator?.$touch()
);

function uploadRequest(options: UploadCustomRequestOptions) {
  console.log(options);
  options.onFinish();
}

const fileList = ref([]);
</script>

<template>
  <div class="w-full">
    <n-upload
      directory-dnd
      :max="1"
      :custom-request="uploadRequest"
      list-type="image-card"
      class="w-full"
    >
      <!-- <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <mdi:upload />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">
          Click or drag a file to this area to upload
        </n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">
          Allowed extensions: .zip, .rar, .7z
        </n-p>
      </n-upload-dragger> -->
    </n-upload>
  </div>
</template>
