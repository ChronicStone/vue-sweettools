export const formatFileExtension = (extensions: string[]) =>
  extensions.map((ext: string) => `.${ext}`).join(", ");

export const convertFileSizeToMb = (size: number) =>
  +(size / 1024 / 1024).toFixed(2);
