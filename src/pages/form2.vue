<script setup lang="tsx">
import FormRenderer from "@/components/Form/Renderer/FormRenderer.vue";
import { formSamples } from "@/samples/form";
import { FormRefInstance } from "@/types/form/instance";
import {
  NButton,
  NCard,
  NTag,
  NScrollbar,
  NTooltip,
  useNotification,
} from "naive-ui";
import { useRouteQuery } from "@vueuse/router";

const instance = getCurrentInstance();
console.log("instance", instance);

const formApi = useFormApi();
const notif = useNotification();
const formRef = ref<FormRefInstance>();

const sampleHeaderRef = ref<HTMLElement>();
const { height } = useElementSize(sampleHeaderRef);

async function printInlineData(index: number) {
  console.log("ref", formRef.value?.$data);
  const data = formRef.value?.$data;
  const isValid = await formRef.value?.$validate();
  notif[isValid ? "success" : "error"]({
    title: `Form data - ${formSamples[index].sample.title}`,
    content: JSON.stringify(data, null, 2),
    duration: 5000,
    keepAliveOnHover: true,
  });
}

async function showModalForm(index: number) {
  const sample = formSamples[index];
  const { formData, isCompleted } = await formApi.createForm(
    sample.sample.schema as any
  );
  notif[isCompleted ? "success" : "error"]({
    title: `Form data - ${formSamples[index].sample.title}`,
    content: JSON.stringify(formData, null, 2),
    duration: 5000,
    keepAliveOnHover: true,
  });
}

const querySampleId = useRouteQuery("sampleId");
const activeSampleId = ref<number>(
  querySampleId.value ? Number(querySampleId.value) : 0
);

watch(
  () => activeSampleId.value,
  (val) => (querySampleId.value = val.toString())
);

const activeSample = computed(() => formSamples[activeSampleId.value].sample);
const isSampleMultiStep = computed(() => "steps" in activeSample.value.schema);

const filteredSamples = computed(() =>
  formSamples
    .map((item, sampleId) => ({ ...item, sampleId }))
    .filter(() => true)
);

function openActiveSampleSchema() {
  formApi.createForm({
    title: `Form schema - ${activeSample.value.title}`,
    fullScreen: true,
    submitButtonText: "CLOSE",
    fields: [
      {
        key: "info",
        type: "info",
        content: () => (
          <pre>{prettyPrintSchema(activeSample.value.schema)}</pre>
        ),
      },
    ],
  });
}

function inspectFormState() {
  formApi.createForm({
    title: `Form state - ${activeSample.value.title}`,
    fullScreen: true,
    submitButtonText: "CLOSE",
    fields: [
      {
        key: "info",
        type: "info",
        content: () => (
          <div class="flex">
            <NCard
              segmented
              theme-overrides={{ borderRadius: "0" }}
              class="w-1/2"
            >
              {{
                header: () => <span>FORM DATA</span>,
                default: () => (
                  <NScrollbar class="max-h-[87vh]">
                    <pre>{formRef.value?.$data}</pre>
                  </NScrollbar>
                ),
              }}
            </NCard>
            <NCard
              segmented
              theme-overrides={{ borderRadius: "0" }}
              class="w-1/2"
            >
              {{
                header: () => <span>VALIDATION STATE</span>,
                default: () => (
                  <NScrollbar class="max-h-[87vh]">
                    <pre>{formRef.value?.$v}</pre>
                  </NScrollbar>
                ),
              }}
            </NCard>
          </div>
        ),
      },
    ],
  });
}
</script>

<template>
  <div class="w-screen h-screen flex">
    <NCard
      segmented
      class="w-[400px] h-full"
      :theme-overrides="{ borderRadius: '0px' }"
      :content-style="{ padding: 0 }"
    >
      <template #header>
        <h1 class="text-xl font-bold">FORM SAMPLES</h1>
      </template>

      <NScrollbar :style="{ maxHeight: `calc(100vh - 80px)` }">
        <NCard
          v-for="{ sample, sampleId } in filteredSamples"
          :key="sampleId"
          class="cursor-pointer"
          :embedded="sampleId === activeSampleId"
          @click="activeSampleId = sampleId"
        >
          <div class="flex flex-col gap-1.5">
            <h2 class="text-lg font-semibold">
              {{ sample.title }}
            </h2>

            <NTag
              size="small"
              class="w-[fit-content]"
              :type="'fields' in sample.schema ? 'info' : 'warning'"
            >
              {{ "fields" in sample.schema ? "SIMPLE FORM" : "STEPPED FORM" }}
            </NTag>

            <span v-if="sample.description" class="text-sm text-gray-500">
              {{ sample.description }}
            </span>
          </div>
        </NCard>
      </NScrollbar>
    </NCard>

    <div class="flex flex-col w-full">
      <div ref="sampleHeaderRef">
        <NCard segmented :theme-overrides="{ borderRadius: '0px' }">
          <template #header>
            <div class="flex flex-col gap-1">
              <h2 class="text-lg font-semibold">
                {{ activeSample.title }}
              </h2>
              <span
                v-if="activeSample.description"
                class="text-sm text-gray-500"
              >
                {{ activeSample.description }}
              </span>
            </div>
          </template>

          <template #header-extra>
            <div class="flex items-center gap-2">
              <NTooltip>
                Open in modal
                <template #trigger>
                  <NButton secondary @click="showModalForm(activeSampleId)">
                    <template #icon>
                      <material-symbols:open-in-browser />
                    </template>
                  </NButton>
                </template>
              </NTooltip>

              <NTooltip>
                Inspect state
                <template #trigger>
                  <NButton secondary @click="inspectFormState">
                    <template #icon>
                      <material-symbols:settings-b-roll />
                    </template>
                  </NButton>
                </template>
              </NTooltip>

              <NTooltip>
                Open schema definition
                <template #trigger>
                  <NButton
                    secondary
                    type="info"
                    @click="openActiveSampleSchema"
                  >
                    <template #icon>
                      <mdi:eye />
                    </template>
                  </NButton>
                </template>
              </NTooltip>
            </div>
          </template>
        </NCard>
      </div>

      <NCard
        class="h-full"
        segmented
        :theme-overrides="{ borderRadius: '0px' }"
        :content-style="{ paddingRight: '4px' }"
      >
        <NScrollbar
          :style="{
            maxHeight: `calc(100vh - ${height}px  - 50px)`,
            paddingRight: '14px',
          }"
        >
          <div :key="activeSampleId" class="flex flex-col gap-6 h-full">
            <FormRenderer ref="formRef" :schema="activeSample.schema" />
            <div class="flex items-center gap-4 w-full">
              <template v-if="isSampleMultiStep">
                <NButton
                  :disabled="!(formRef?.canTriggerPrevious ?? true)"
                  secondary
                  type="primary"
                  @click="formRef?.previousStep?.()"
                >
                  BACK
                  <template #icon> <mdi:arrow-left /> </template>
                </NButton>

                <NButton
                  secondary
                  type="primary"
                  icon-placement="right"
                  @click="
                    formRef?.canTriggerNext
                      ? formRef?.nextStep?.()
                      : printInlineData(activeSampleId)
                  "
                >
                  {{ formRef?.canTriggerNext ? "NEXT" : "SUBMIT" }}
                  <template #icon>
                    <mdi:arrow-right v-if="formRef?.canTriggerNext" />
                    <mdi:check v-else />
                  </template>
                </NButton>
              </template>

              <template v-else>
                <NButton
                  type="primary"
                  icon-placement="right"
                  @click="printInlineData(activeSampleId)"
                >
                  <template #icon>
                    <mdi:chevron-right />
                  </template>
                  SUBMIT
                </NButton>
              </template>
            </div>
          </div>
        </NScrollbar>
      </NCard>

      <div class="flex">
        <NCard segmented :theme-overrides="{ borderRadius: '0' }" class="w-1/2">
          <template #header> FORM DATA </template>

          <NScrollbar class="max-h-[87vh]">
            <pre>
            {{ formRef?.$data }}
            </pre>
          </NScrollbar>
        </NCard>

        <NCard segmented :theme-overrides="{ borderRadius: '0' }" class="w-1/2">
          <template #header> VALIDATION STATE </template>

          <NScrollbar class="max-h-[87vh]">
            <pre>
            {{ formRef?.$v }}
          </pre
            >
          </NScrollbar>
        </NCard>
      </div>
    </div>
  </div>
</template>
