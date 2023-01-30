import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineUsers,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { FiFolder } from "react-icons/fi";

export const menusUser = [
  {
    name: "پروفایل",
    link: "/dashboard",
    icon: HiOutlineUserCircle,
  },
  {
    name: "لیست من",
    link: "/dashboard/mylist",
    icon: FiFolder,
    margin: false,
  },
  {
    name: "خروج",
    link: "/",
    icon: HiOutlineArrowRightOnRectangle,
    margin: false,
  },
];
export const menusAdmin = [
  { name: "پروفایل", link: "/admin", icon: HiOutlineUserCircle },
  { name: "کاربران", link: "/admin/users", icon: HiOutlineUsers },
  { name: "دسته بندی", link: "/admin/category", icon: FiFolder, margin: false },
  { name: "فیلم", link: "/admin/movies", icon: FiFolder, margin: false },
  { name: "لیست من", link: "/admin/mylist", icon: FiFolder, margin: false },
  { name: " گزارش", link: "/admin/report", icon: FiFolder, margin: false },
  { name: " تنظیمات", link: "/admin/setting", icon: FiFolder, margin: false },
  {
    name: "خروج",
    link: "/",
    icon: HiOutlineArrowRightOnRectangle,
    margin: false,
  },
];
