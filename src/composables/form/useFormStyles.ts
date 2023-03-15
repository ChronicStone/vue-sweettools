import { SteppedFormSchema } from "@/types/form/form";
import { FormSchema } from "@/types/form/form";

export const DEFAULT_STYLES = {
  fullScreen: "false",
  maxWidth: "95vw md:85vw lg:80vw",
  maxHeight: "95vh md:90vh",
  gridSize: 8,
  fieldSize: "8 md:4",
  stepperLayout: "full",
} as const;

const [useProvideFormStyles, _useFormStyles] = createInjectionState(
  (formSchema: FormSchema) => {
    const formStyles = {
      fullScreen: useBreakpointStyle(
        formSchema?.fullScreen ?? DEFAULT_STYLES.fullScreen,
        "boolean"
      ),
      maxHeight: useBreakpointStyle(
        formSchema?.maxHeight ?? DEFAULT_STYLES.maxHeight,
        "value"
      ),
      maxWidth: useBreakpointStyle(
        formSchema?.maxWidth ?? DEFAULT_STYLES.maxWidth,
        "value"
      ),
      gridSize: useBreakpointStyle(
        formSchema?.gridSize ?? DEFAULT_STYLES.gridSize,
        "grid-cols"
      ),
      fieldSize: useBreakpointStyle(
        formSchema?.fieldSize ?? DEFAULT_STYLES.fieldSize,
        "col"
      ),
      stepperLayout: useBreakpointStyle("full", "value"),
    };

    return formStyles;
  }
);

function useFormStyles() {
  const stylesApi = _useFormStyles();
  if (!stylesApi) throw new Error("No parent style provider found");
  return stylesApi;
}

export { useProvideFormStyles, useFormStyles };
