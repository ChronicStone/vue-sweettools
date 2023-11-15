import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useIsMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  return breakpoints.smaller('lg')
}
