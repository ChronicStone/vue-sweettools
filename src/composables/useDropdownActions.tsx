import {
  type VNodeChild,
  type MaybeRefOrGetter,
  type MaybeRef,
  toValue,
} from "vue";

export interface DropdownAction {
  label: string | (() => VNodeChild);
  icon?: string;
  action: () => void;
  disable?: boolean | (() => boolean);
  condition?: () => boolean;
}

export interface MappedDropdownAction {
  label: string | (() => VNodeChild);
  icon?: () => VNodeChild;
  disabled: boolean;
  hidden: boolean;
  props: {
    onClick: () => void;
  };
}

type RawActionItems = Array<DropdownAction | { type: "divider" }>;

export function useDropdownActions(
  actions:
    | RawActionItems
    | MaybeRefOrGetter<RawActionItems>
    | MaybeRef<RawActionItems>
) {
  return computed(() =>
    toValue(actions)
      .map((action) => {
        if ("type" in action)
          return { type: "divider", hidden: false, key: generateUUID() };
        else
          return {
            key: generateUUID(),
            label: action.label,
            ...(action.icon && { icon: renderIcon(action.icon) }),
            disabled:
              typeof action.disable === "function"
                ? action.disable()
                : action?.disable ?? false,
            hidden:
              typeof action.condition === "function"
                ? !action.condition()
                : false,
            props: {
              onClick: () => action.action(),
            },
          };
      })
      .filter((action) => !action.hidden)
  );
}
