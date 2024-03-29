import { useBreakpoints as useSourceBreakpoints } from '@vueuse/core'

interface Breakpoints {
  [key: string]: number
}

export function useBreakpoints(rawBreakpoints: Breakpoints) {
  const breakpoints = useSourceBreakpoints(rawBreakpoints)
  const orderedSource = Object.entries(rawBreakpoints)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => +b.value - +a.value)
    .map(({ key }) => key)
  const reactiveBreakpoints = Object.entries(breakpoints)
    .map(([key, value]) => ({ key, value }))
    .filter(({ key }) => Object.keys(rawBreakpoints).includes(key))
    .sort(
      (a, b) => orderedSource.indexOf(a.key) - orderedSource.indexOf(b.key),
    )

  return {
    reactiveBreakpoints,
    breakpointsDefObject: breakpoints,
    breakpointsKeys: Object.keys(breakpoints),
  }
}
