import type { VNodeChild, VNodeNormalizedChildren } from 'vue'
import { createTextVNode } from 'vue'

import { NIcon } from 'naive-ui'
import type { FormField } from '@/form/types/fields'

export function renderVNode<T extends any[]>(r:
| string
| number
| undefined
| null
| ((...args: [...T]) => VNodeChild)
| unknown, ...args: [...T]): VNodeChild {
  if (typeof r === 'function') {
    const node = r(...args)
    return typeof node === 'string' ? createTextVNode(node) : node
  }
  else if (typeof r === 'string') {
    return createTextVNode(r)
  }
  else if (typeof r === 'number') {
    return createTextVNode(String(r))
  }
  else {
    return null
  }
}

export function renderIcon(icon: string) {
  return () =>
    (
      <NIcon>
        <span class="iconify" data-icon={icon}></span>
      </NIcon>
    )
}

export function preRenderStringContent(content: string | VNodeChild) {
  return typeof content === 'string'
    ? () => <div v-html={content}></div>
    : content
}

export function extractTextFromVNode(
  vNode: VNodeNormalizedChildren | string,
): string[] {
  const extractedText: string[] = []
  if (typeof vNode === 'string')
    return [vNode]

  if (vNode && 'children' in vNode && Array.isArray(vNode.children)) {
    for (const child of vNode.children) {
      if ('children' in child && typeof child.children === 'string')
        extractedText.push(child.children)
      else extractedText.push(...extractTextFromVNode(child))
    }
  }

  return extractedText
}

export function normalizeFieldLabel(
  field: FormField,
  context: ReturnType<typeof useFieldContext>,
) {
  if (!field.label)
    return field.key
  if (typeof field.label == 'string') { return field.label.toLocaleLowerCase() }
  else if (typeof field.label == 'function') {
    const _label = field.label(context.dependencies.value)

    return typeof _label === 'string'
      ? _label
      : extractTextFromVNode(_label as any)
        .join(' ')
        .toLocaleLowerCase()
  }
}
