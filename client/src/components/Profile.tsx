import { useEffect, useState } from "react";

//module external
import { HiEllipsisVertical } from "react-icons/hi2";
import { motion } from "framer-motion";
import * as timeago from "timeago.js/lib/index";
import { Link, Outlet } from "react-router-dom";
//
import { StateTypeAuth, Users } from "../typeing";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fatchAllUsers, fatchUsers, restartDefault } from "../features/users/users";

//interface
interface State {
  users: {
    users: Users[];
    allusres: Users[] ;
    insert: number;
    count: number;
    delete: number;
    update: number;
    isLoading: boolean;
    ErrorMessage: string | null;
  };
}

//component
const Profile = () => {
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);
  const stateUsers = useAppSelector((state: State) => state?.users);
  const [users, setUser] = useState<Users[]>([]);
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    if(user?.userInfo){
      dispatch(fatchAllUsers({ axiosPrivate }));
      dispatch(restartDefault())
    }
  }, []);

  //
  useEffect(()=> {
 if (stateUsers?.allusres && user?.userInfo) {
      const USER = stateUsers?.allusres.filter((U) => U.id == user?.userInfo?.id);
      setUser(USER || []);
    }
  }, [stateUsers?.users]);
  //  Back to default when entering the page
  useEffect(() => {
    dispatch(restartDefault())
    dispatch(fatchAllUsers({ axiosPrivate }));
  }, [stateUsers?.update]);
  //return
  return (
    <div>
      <section className=" bg-[#071e34] flex font-medium items-center justify-center h-screen">
        <section className="w-64 mx-auto bg-[#20354b] rounded-2xl px-8 py-6 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">
              <span>
                {timeago?.format(users[0]?.createdAt || "2022-10-25")}
              </span>
            </span>
            <Link
              to={`edit/${user?.userInfo?.id}`}
              className="text-emerald-400"
            >
              <HiEllipsisVertical size={25} />
            </Link>
          </div>
          <div className="mt-6 w-fit mx-auto">
            <img
              src={
                users[0]?.image }
              className="rounded-full w-28 "
              alt={user?.userInfo?.username}
            />
          </div>

          <div className="mt-8 ">
            <h2 className="text-white font-bold text-2xl tracking-wide">
              {user?.userInfo?.username}
            </h2>
          </div>
          <p className="text-emerald-400 font-semibold mt-2.5">
            {user?.userInfo?.role && user.userInfo.role == "admin"?"مدیر":user?.userInfo?.role == "user"?"کاربر":""}
          </p>
          {timeago.format(users[0]?.updatedAt || "").includes("just") ? (
            <div className="mt-3 text-white text-sm text-center">
              <span className="text-gray-400 font-semibold">
                ویرایش انجام شد
              </span>
            </div>
          ) : null}
        </section>
      </section>
      <Outlet />
    </div>
  );
};

export default Profile;
