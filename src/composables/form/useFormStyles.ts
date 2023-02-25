import { FormSchema } from "@/types/form/form";

export const DEFAULT_STYLES = {
  fullScreen: "false",
  maxWidth: "95vw md:85vw lg:80vw",
  maxHeight: "95vh md:90vh",
  gridSize: 8,
  fieldSize: "8 md:4",
  stepperLayout: "full",
} as const;

const [useProvideFormStyles, useFormStyles] = createInjectionState(
  (formSchema: FormSchema) => {
    const formStyles = {
      fullScreen: useBreakpointStyle(
        formSchema?.fullScreen ?? DEFAULT_STYLES.fullScreen,
        "boolean"
      ),
      maxHeight: useBreakpointStyle(
        formSchema?.maxHeight ?? DEFAULT_STYLES.maxHeight,
        "maxHeight"
      ),
      maxWidth: useBreakpointStyle(
        formSchema?.maxWidth ?? DEFAULT_STYLES.maxWidth,
        "maxWidth"
      ),
      gridSize: useBreakpointStyle(
        8, // formSchema?.gridSize ?? DEFAULT_STYLES.gridSize,
        "grid-cols"
      ),
      fieldSize: useBreakpointStyle(
        "8 md:4", //formSchema?.fieldSize ?? DEFAULT_STYLES.fieldSize,
        "col"
      ),
    };

    return formStyles;
  }
);

export { useProvideFormStyles, useFormStyles };
