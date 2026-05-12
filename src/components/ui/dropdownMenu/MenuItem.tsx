import { IconType } from "react-icons";

export interface MenuItemProps {
    icon: IconType
    title: string
    iconColor: string
}

export default function MenuItem ({ icon: Icon, title, iconColor}: MenuItemProps) {
    return (
      <>
        <Icon className={`text-${iconColor} `}  />
        {title}
      </>
    );
}