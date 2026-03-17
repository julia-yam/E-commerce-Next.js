import * as React from "react";
import { Icon } from "@components/index";
import { type IconProps } from "@components/icons/Icon/configs";

const MoonIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path
      d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

export default MoonIcon;
