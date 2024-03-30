/* eslint-disable ts/ban-types */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

// declare module '@chronicstone/vue-testid' {
//   import type { Directive } from 'vue'

//   export type TestIdSelector = string | {
//     value: string
//     selector: string
//     parentScope?: boolean
//   } | {
//     multiple: boolean
//     value: (index: number) => string
//     selector: string
//     parentScope?: boolean
//   } | Array<{
//     value: string
//     selector: string
//     parentScope?: boolean
//   } | {
//     multiple: boolean
//     value: (index: number) => string
//     selector: string
//     parentScope?: boolean
//   } | string>
//   export const vTestid: Directive<HTMLElement, TestIdSelector>

// }
