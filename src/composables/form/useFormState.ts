const [useProvideFormState, _useFormState] = createInjectionState(() => {
  const formState = ref<{ [key: string]: any }>({});
  const outputFormState = computed(() => formState.value);

  function reset() {
    formState.value = {};
  }

  return { formState, outputFormState, reset };
});

function useFormState() {
  const state = _useFormState();
  if (!state) throw Error("Missing parent state provier");

  return state;
}

export { useProvideFormState, useFormState };
