import { GlobalThemeOverrides } from "naive-ui";
import { deepmerge } from "deepmerge-ts";

export const DefaultThemeOverrides = {
  common: {
    borderRadius: "6px",
    primaryColor: "#FF9600",
    primaryColorHover: "#ffaa30",
    primaryColorPressed: "#e38600",
    primaryColorSuppl: "#FF9600",
    heightTiny: "26px",
    heightSmall: "32px",
    heightMedium: "38px",
    heightLarge: "44px",
    heightHuge: "50px",
  },
  DataTable: {
    borderRadius: "6px",
  },
  TableHeader: {
    borderRadius: "6px",
  },
  Alert: {
    padding: "5px 8px",
  },
  Tag: {
    borderRadius: "6px",
  },
  LoadingBar: {
    height: "4.5px",
  },
};

const _lightThemeOverrides = {
  common: {
    bodyColor: "#f7f7f7",
  },
};

const _darkThemeOverrides = {
  common: {
    bodyColor: "#242424",
    //   cardColor: '#1A1A1A',
    //   modalColor: '#1A1A1A',
    //   scrollbarWidth: '5px',
    //   fontFamily: 'Lato',
    //   popoverColor: '#1A1A1A',
  },
  // Input: {
  //   color: '#363434',
  // },
  // InternalSelection: {
  //   color: '#363434',
  // },
  // ColorPicker: {
  //   color: '#363434',
  // },
  // Slider: {
  //   fillColor: 'rgba(185, 38, 180, 1)',
  // },
  // Card: {
  //   colorEmbedded: 'rgba(49, 51, 65, 1)',
  // },
};

export const DarkThemeOverrides = deepmerge(
  DefaultThemeOverrides,
  _darkThemeOverrides
);
export const LightThemeOverrides = deepmerge(
  DefaultThemeOverrides,
  _lightThemeOverrides
);
