export function useEventDispatcher<
  T extends (...args: any[]) => any = (...args: any[]) => any
>() {
  const subscribers = shallowRef<{ _id: string; handler: T }[]>([]);

  function removeSubscriber(id: string) {
    subscribers.value = subscribers.value.filter((s) => s._id !== id);
  }

  function subscribe(handler: T) {
    const _id = generateUUID();
    subscribers.value.push({ _id, handler });
    return () => removeSubscriber(_id);
  }

  function dispatch(...args: Parameters<T>) {
    subscribers.value.forEach((s) => s.handler(...args));
  }

  return { subscribe, dispatch };
}
