import React, { useState, useEffect } from "react";

//module external
import { HiMenuAlt3 } from "react-icons/hi";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { Link } from "react-router-dom";

//
import { StateTypeAuth } from "../typeing";
import { IconType } from "react-icons/lib";
import { useRecoilState } from "recoil";
import { modalSidebarAdmin } from "../atoms/modalAtom";
import { menusAdmin, menusUser } from "../data/dataSidebarDashboard";
import { useAppSelector, useAppDispatch } from "../app/hooks";

//interface

interface Menus {
  name: string;
  link: string;
  icon: IconType;
  margin?: boolean | undefined;
}

const SidebarDashboard = () => {
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);
  const [open, setOpen] = useState(true);
  const [menus, setMenus] = useState<Menus[]>([]);
  const [Sidebar, setSidebar] = useRecoilState(modalSidebarAdmin);

  useEffect(() => {
    const User=sessionStorage.getItem("accesstoken");
    const token= User && JSON.parse(`${User}`);
    if(token){
      token?.userInfo?.role === "admin"
      ? setMenus(menusAdmin)
      : setMenus(menusUser);
    }
  }, []);

  const handleSidebarCollaps = () => {
    setOpen(!open);
    setSidebar(!Sidebar);
  };

  return (
    <section className="flex scrollbar-hide flex transition-all gap-6 py-0">
      <div
        className={`bg-[#1b2a4e] overflow-hidden overflow-y-auto relative h-screen scrollbar-hide ${
          open ? "w-40" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => handleSidebarCollaps()}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {user?.userInfo?.username ? (
            <div
              className={`group flex items-center text-sm  gap-3.5 font-medium p-2 rounded-md`}
              //  onClick={}
            >
              <div>
                {React.createElement(HiOutlineUserCircle, { size: "30" })}
              </div>
              <div>
                <div>
                  <h2 className="text-gray-400">خوش آمدید</h2>
                </div>
                <div className="overflow-hidden">
                  <h2
                    style={{
                      transitionDelay: `${menus?.length + 1}00ms`,
                    }}
                    className={`whitespace-pre duration-500 ${
                      !open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                  >
                    {user?.userInfo?.username}
                  </h2>
                  <h2
                    className={`${
                      open && "hidden"
                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                  >
                    {user?.userInfo?.username}
                  </h2>
                </div>
              </div>
            </div>
          ) : null}
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={` ${
                menu?.margin && "mt-5"
              } group flex items-center text-sm  gap-3.5 font-medium p-2 bg-white/[0.1] hover:bg-white/[0.15] rounded-md`}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SidebarDashboard;
