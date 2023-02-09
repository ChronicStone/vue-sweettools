import { NIcon } from "naive-ui";

export const renderIcon = (icon: string) => () =>
  (
    <NIcon>
      <span class="iconify" data-icon={icon}></span>
    </NIcon>
  );
