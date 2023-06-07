import { createTextVNode, VNodeChild } from "vue";

export const renderVNode = <T extends any[]>(
  r:
    | string
    | number
    | undefined
    | null
    | ((...args: [...T]) => VNodeChild)
    | unknown,
  ...args: [...T]
): VNodeChild => {
  if (typeof r === "function") {
    const node = r(...args);
    return typeof node === "string" ? createTextVNode(node) : node;
  } else if (typeof r === "string") {
    return createTextVNode(r);
  } else if (typeof r === "number") {
    return createTextVNode(String(r));
  } else {
    return null;
  }
};

export function preRenderStringContent(content: string | VNodeChild) {
  return typeof content === "string" ? () => <div v-html={content}></div> : content;
}
