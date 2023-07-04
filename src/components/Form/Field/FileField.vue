<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import {
  formatFileExtension,
  convertFileSizeToMb,
} from "@/utils/general/format";
import { useMessage, useThemeVars, NSpin } from "naive-ui";
import { renderVNode } from "@/utils/renderVNode";

type IFile = {
  fileName: string;
  fileSize: number;
  fileBody: string | ArrayBuffer | File;
  fileExtension: string;
};

const messageApi = useMessage();
const themeVars = useThemeVars();
const isLoading = ref<boolean>();

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const allowedExtensions = computed(
  () => props.context.inputProps.value?.extensions ?? null
);
const maxFileSize = computed(
  () => props.context.inputProps.value?.maxSize ?? null
);
const outputFormat = computed<"file" | "arrayBuffer" | "base64">(
  () => props.context.inputProps.value?.format ?? "file"
);

const isDragged = ref<boolean>(false);
const uploadLabel = ref<HTMLElement | null>(null);
const isHovered = useElementHover(uploadLabel as unknown as HTMLElement);

async function postProcessFile(file: IFile) {
  try {
    let processedFile: unknown = file;
    const postProcessor = props.context.inputProps.value?.postProcess;
    if (typeof postProcessor === "function") {
      isLoading.value = true;
      processedFile = await postProcessFile(file);
      isLoading.value = false;
    }
    fieldValue.value = processedFile;
  } catch (err) {
    messageApi.error(
      `File post-processing failed - ${err?.toString() ?? "unexpected error"}`
    );
  }
}

function handleFileDrop(
  e: (DragEvent | Event) & {
    dataTransfer?: DataTransfer;
    target?: { files: File[] };
  }
) {
  const file = e?.dataTransfer?.files[0] ?? e?.target?.files[0];
  const fileExtension = file?.name?.split(".").pop() ?? "";
  if (
    allowedExtensions.value?.length &&
    !allowedExtensions.value.includes(fileExtension)
  )
    return messageApi.error(
      `Only ${formatFileExtension(allowedExtensions.value)} files are supported`
    );
  if (
    maxFileSize.value != null &&
    convertFileSizeToMb(file?.size) > maxFileSize.value
  )
    return messageApi.error(
      `File size is too big. Maximum file size is ${maxFileSize} Mb`
    );

  if (outputFormat.value === "file")
    postProcessFile({
      fileName: file?.name,
      fileExtension,
      fileBody: file,
      fileSize: convertFileSizeToMb(file?.size ?? 0),
    });

  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) =>
    postProcessFile({
      fileName: file?.name,
      fileExtension,
      fileBody: e?.target?.result ?? "",
      fileSize: convertFileSizeToMb(file?.size ?? 0),
    });
  if (outputFormat.value === "arrayBuffer") reader.readAsArrayBuffer(file);
  else reader.readAsDataURL(file);
}

function renderFilePreview(file: unknown) {
  const renderPreview =
    props.context.inputProps.value?.renderPreview ??
    ((file: unknown) => `${(file as any)?.fileName}`);
  return renderVNode(renderPreview, file);
}

watch(
  () => isHovered.value,
  (value: boolean) => !value && (isDragged.value = false)
);
</script>

<template>
  <NSpin :show="isLoading">
    <label ref="uploadLabel" for="VFileDropZone">
      <div
        class="cursor-pointer w-full h-auto min-h-32 py-8 border border-dashed border-4 grid place-items-center transition-all ease-in-out duration-150"
        :style="{
          borderRadius: themeVars.borderRadius,
          backgroundColor: themeVars.bodyColor,
          borderColor:
            isDragged || isHovered
              ? themeVars.primaryColor
              : themeVars.borderColor,
        }"
        @drop.prevent="handleFileDrop($event as any)"
        @dragover.prevent="isDragged = true"
        @dragleave.prevent="isDragged = false"
      >
        <div class="flex flex-col items-center gap-4">
          <slot name="icon">
            <NIcon size="48">
              <mdi:box-download />
            </NIcon>
          </slot>
          <slot>
            <div class="flex flex-col gap-2 items-center">
              <p>Click or drag a file to this area to upload.</p>
              <p
                v-if="allowedExtensions.length || maxFileSize != null"
                class="text-xs text-gray-500 flex flex-col gap-1 items-center"
              >
                <span>
                  Accepted extensions:
                  {{ formatFileExtension(allowedExtensions) }}
                </span>
                <span v-if="maxFileSize !== null">
                  Maximum file size: {{ maxFileSize }}
                </span>
              </p>
            </div>
          </slot>

          <template v-if="$slots.extraInfos">
            <NDivider class="!m-0" />

            <div class="p-4">
              <slot name="extraInfos"></slot>
            </div>
          </template>
        </div>
      </div>
    </label>
    <input
      id="VFileDropZone"
      class="hidden"
      type="file"
      :accept="allowedExtensions.join(', ')"
      @change="handleFileDrop($event as any)"
    />
  </NSpin>
</template>
