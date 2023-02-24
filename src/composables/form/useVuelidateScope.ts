const [useProvideValidationScope, _useValidationScope] = createInjectionState(
  () => {
    const scopeKey = generateUUID();
    return {
      scopeKey,
    };
  }
);

function useValidationScope() {
  return _useValidationScope() ?? { scopeKey: "" };
}

export { useProvideValidationScope, useValidationScope };
