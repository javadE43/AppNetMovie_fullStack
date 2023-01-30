import React, { useState, useEffect } from "react";

//module external
import { HiMenuAlt3 } from "react-icons/hi";
import { BsX,BsDoorClosed } from "react-icons/bs";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUserCircle,
} from "react-icons/hi2";

//
import { useAppSelector,useAppDispatch } from "../app/hooks";
import { StateTypeAuth } from "../typeing";
import { menuAdmin, Menus, menuUser } from "../data/dataSaidebarHome";
import { closesidebar } from "../features/sidebar/sidebar";
import { logout } from "../features/auth/auth";
import useAxiosPrivate from "../hook/useAxiosPrivate";


interface Props{
  role:string
}

const Sidebar = ({role}:Props) => {
  const [menus, setMenus] = useState<Menus[]>([]);
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);
  const dispatch= useAppDispatch();
  const navigate = useNavigate();
  const axiosPrivate=useAxiosPrivate()

  const [open, setOpen] = useState(true);
  const hanlerLogout = async () => {
    try {
      await axiosPrivate.get("/auth/logout");
      dispatch(logout());
      navigate("/");
    } catch (error) {}
  };

  useEffect(() => {
    role === "admin" ? setMenus(menuAdmin) : setMenus(menuUser);
  }, [role]);
  //return
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%", transition: { duration: 0.3 } }}
      exit={{ x: window.innerWidth, transition: { duration: 0.1 } }}
    >
      <section className="flex sticky top-14 z-[150] heightSidebar gap-6 md:hidden">
        <div
          className={`bg-sidebar min-h-screen ${
            open ? "w-60" : "w-16"
          } duration-500 text-gray-100 px-4`}
        >
          <div className="h-[500px] overflow-hidden overflow-y-scroll scrollbar-hide">
            {!open ? (
              <div className="py-3 flex justify-end">
                <BsX
                  size={26}
                  className="cursor-pointer text-red-400"
                  onClick={() => dispatch(closesidebar())}
                />
              </div>
            ) : null}
            <div className="py-3 flex justify-end">
              <HiMenuAlt3
                size={26}
                className="cursor-pointer"
                onClick={() => setOpen(!open)}
              />
            </div>
            <div className="mt-4 flex flex-col gap-4 relative">
              {user?.userInfo?.username ? (
                <div
                  className={`group flex ${
                    open ? "justify-center" : null
                  } items-center text-sm  gap-3.5 font-medium p-1 rounded-md`}
                  //  onClick={}
                >
                  <div>
                    {React.createElement(HiOutlineUserCircle, { size: "30" })}
                  </div>
                  <div>
                    <div>
                      <h2 className="text-gray-400">خوش آمدید</h2>
                    </div>
                    <div>
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
              <Link
                to=""
                className={` group flex items-center text-sm  gap-3.5 font-medium p-2 bg-white/[0.1] hover:bg-white/[0.15] rounded-md`}
                onClick={hanlerLogout}
              >
                <div>
                  {React.createElement(BsDoorClosed, {
                    size: "20",
                  })}
                </div>
                <h2
                  style={{
                    transitionDelay: `${menus?.length + 3}00ms`,
                  }}
                  className={`whitespace-pre duration-500 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  خروج
                </h2>
                <h2
                  className={`${
                    open && "hidden"
                  } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                >
                  خروج
                </h2>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default React.memo(Sidebar);
