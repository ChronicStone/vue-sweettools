export function obsoletableFn(fn: (...args: any[]) => void) {
  let lastCaller: symbol | null = null;
  return (...args: any[]) => {
    const me = Symbol();
    lastCaller = me;
    const isObsolete = () => lastCaller !== me;
    return fn(isObsolete, ...args);
  };
}
