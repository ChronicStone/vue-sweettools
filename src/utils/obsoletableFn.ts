export function obsoletableFn<
  Fn extends (isObsolete: () => boolean, ...args: any[]) => any,
  FnArgs extends Parameters<Fn> extends [any, ...infer Args] ? Args : never
>(fn: Fn) {
  let lastCaller: symbol | null = null;
  return (...args: FnArgs) => {
    const me = Symbol();
    lastCaller = me;
    const isObsolete = () => lastCaller !== me;
    return fn(isObsolete, ...args);
  };
}
