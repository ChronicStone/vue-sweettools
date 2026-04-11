export function isDirty(initialState: any, currentState: any): boolean {
  const compareArrays = (arr1: any[], arr2: any[]): boolean => {
    if (arr1.length !== arr2.length)
      return true

    for (let i = 0; i < arr1.length; i++) {
      if (isDirty(arr1[i], arr2[i]))
        return true
    }
    return false
  }

  // Helper function to compare objects
  const compareObjects = (obj1: { [key: string]: any }, obj2: { [key: string]: any }): boolean => {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length)
      return true

    for (const key of keys1) {
      if (!(key in obj2) || isDirty(obj1[key], obj2[key]))
        return true
    }
    return false
  }

  if (initialState === currentState)
    return false

  if (typeof initialState !== typeof currentState)
    return true

  if (Array.isArray(initialState) && Array.isArray(currentState))
    return compareArrays(initialState, currentState)

  if (typeof initialState === 'object' && typeof currentState === 'object' && initialState !== null && currentState !== null)
    return compareObjects(initialState, currentState)

  // For primitives (string, number, boolean), the first condition would have already returned false if they are equal
  return true
}
