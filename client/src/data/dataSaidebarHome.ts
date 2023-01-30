import { BsPeopleFill } from "react-icons/bs";
import { FiFolder } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import { IconType } from "react-icons/lib";
export interface Menus {
    name: string;
    link: string;
    icon: IconType;
    margin?: boolean | undefined;
  }
export const menuAdmin = [
  { name: "پنل کاربری", link: "/admin", icon: MdOutlineDashboard },
  { name: "اکشن", link: "/action", icon: FiFolder, margin: true },
  { name: "برترین ها", link: "/comady", icon: FiFolder },
  { name: "سریال", link: "/action", icon: FiFolder },
  { name: "لیست من", link: "/mylist", icon: FiFolder },
  { name: "کاربران", link: "/admin/users", icon: BsPeopleFill },
];
export const menuUser = [
  { name: "پنل کاربری", link: "/dashboard", icon: MdOutlineDashboard },
  { name: "اکشن", link: "/action", icon: FiFolder, margin: true },
  { name: "برترین ها", link: "/comady", icon: FiFolder },
  { name: "سریال", link: "/action", icon: FiFolder },
  { name: "لیست من", link: "/me/mylist", icon: FiFolder },
];
