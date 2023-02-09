export const getColorFormat = (color: string) => {
  if (color.startsWith("rgb")) return "rgb";
  else if (color.startsWith("rgba")) return "rgba";
  else if (color.startsWith("#")) return "hex";
  else return "unknown";
};

export const convertHexToRgba = (hex: string, opacity: number) => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const changeRgbaOpacity = (rgba: string, opacity: number) => {
  const rgbaArr: any = rgba.replace("rgba(", "").replace(")", "").split(",");
  rgbaArr[3] = opacity;
  return `rgba(${rgbaArr.join(",")})`;
};
