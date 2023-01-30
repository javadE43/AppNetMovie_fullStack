import { useState, CSSProperties, useCallback, useEffect } from "react";

//module extra
import { useForm, SubmitHandler } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";
import MuiModal from "@mui/material/Modal";
import { HiOutlineXMark } from "react-icons/hi2";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import MoonLoader from "react-spinners/MoonLoader";

//
import useAxiosPrivate from "../hook/useAxiosPrivate";

import { Users, Userinfo } from "../typeing";
import { modalCreateUser, modalEditUser } from "../atoms/modalAtom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fatchInsertUsers, fatchUsers } from "../features/users/users";

// interface and stylecss
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -50%)",
  right: "44%",
};
const overrideupdate: CSSProperties = {
  borderColor: "#36d7b7",
  position: "absolute",
  top: "50%",
  right: "44%",
};
interface State {
  users: {
    users: Users[] ;
    insert: number;
    count: number;
    delete: number;
    update: number;
    isLoading: boolean;
    ErrorMessage: string | null;
  };
}

interface Inputs {
  email: string
  username: string
  mobile: string
  password: string
  roleuser: string
  profile: string
  image: string;
  confirm:string
}

//component
const NewUser = () => {
  let [color, setColor] = useState("#ffffff");
  let [modal, setModal] = useState<boolean>(false);
  const [showModalCreateUser, setShowModalCreateUser] =
    useRecoilState(modalCreateUser);

  const dispatch = useAppDispatch();
  const stateUsers = useAppSelector((state: State) => state?.users);
  const [Errormsg, setErrormsg] = useState<string>("");
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const handleClose = () => {
    setModal(false);
    navigate("/dashboard/users")
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("image", data.image[0]);
    formData.append("password", data.password);
    formData.append("username", data.username);
    formData.append("mobile", data.mobile);
    formData.append("email", data.email);
    formData.append("profile", data.profile);
    formData.append("roleuser", data.roleuser);
    formData.append("confirm", data.confirm);
    dispatch(fatchInsertUsers({axiosPrivate,data:formData}));
  };

  const handleInsert = useCallback(() => {
    if (stateUsers?.insert === 201) {
      // dispatch(fatchUsers({axiosPrivate, page: 1, pageSize: 3 }));
      // setShowModalCreateUser(false);
      window.history.back()
    }
  }, [stateUsers?.insert]);

  //useEffect
  useEffect(() => {
    handleInsert();
  }, [stateUsers?.insert]);

  //
  useEffect(() => {
    setModal(true);
  }, []);
  return (
    <>
      <MuiModal
        open={stateUsers?.isLoading}
        className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <ClipLoader
          color={color}
          loading={stateUsers?.isLoading}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </MuiModal>
      <MuiModal
        open={
          stateUsers?.insert === 102
            ? true
            : stateUsers?.insert === 1
            ? false
            : false
        }
        className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <MoonLoader
          color={"#36d7b7"}
          loading={
            stateUsers?.insert === 102
              ? true
              : stateUsers?.insert === 1
              ? false
              : false
          }
          cssOverride={overrideupdate}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </MuiModal>
      <MuiModal
        open={modal}
        onClose={() => handleClose()}
        className="fixed  overflow-x-hidden !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <motion.div
          // initial={{ opacity: 0, x: 0 }}
          // animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
          // exit={{ opacity: 0, x: 0, transition: { duration: 0.1 } }}
        >
          <div className="flex justify-center m-5">
            <span className="block text-white bg-red-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              ایجاد کاربر جدید
            </span>
          </div>

          {/* <!-- Main modal --> */}
          <div className=" z-50 flex justify-center items-center w-full md:inset-0 h-modal md:h-full">
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
              {/* <!-- Modal content --> */}
              <div className="relative p-4 bg-[#1b2a4e] rounded-lg shadow dark:bg-gray-800 sm:p-5">
                {/* <!-- Modal header --> */}
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-white dark:text-white">
                    بستن
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => handleClose()}
                  >
                    <HiOutlineXMark size={25} className="text-red-500" />
                    <span className="sr-only">بستن</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div className="col-span-full">
                      <label
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                        form="file_input"
                      >
                        Upload file
                      </label>
                      <input
                        className="block p-2 w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        type="file"
                        {...register("image")}
                      />
                    </div>

                    <div>
                      <label
                        form=""
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                      >
                        {errors.username && (
                          <p className="text-sm  text-orange-500">
                            نام کاربری را وارد کنید
                          </p>
                        )}
                        نام کاربری
                      </label>
                      <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-red-400 focus:border-red-400 block w-full p-2.5 dark:bg-gray-700 dark:border-red-400 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-400 dark:focus:border-red-400"
                        placeholder="نام کاربری"
                        {...register("username")}
                      />
                    </div>

                    <div>
                      <label
                        form=""
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                      >
                        {errors.email && (
                          <p className="text-sm  text-orange-500">
                            ایمیل را وارد کنید
                          </p>
                        )}
                        ایمیل
                      </label>
                      <input
                        type="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="ایمیل"
                        {...register("email")}
                      />
                    </div>
                    <div>
                      <label
                        form=""
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                      >
                        {errors.mobile && (
                          <p className="text-sm  text-orange-500">
                            ایمیل را وارد کنید
                          </p>
                        )}
                        موبایل
                      </label>
                      <input
                        type="tel"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="09354635435"
                        {...register("mobile")}
                      />
                    </div>
                    <div>
                      <label
                        form=""
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                      >
                        {errors.password && (
                          <p className="text-sm  text-orange-500">
                            رمز ورود را وارد کنید
                          </p>
                        )}
                        رمز ورود
                      </label>
                      <input
                        type="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="45343@$%J"
                        {...register("password", {
                          required: true,
                          pattern: /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])/,
                        })}
                      />
                    </div>
                    <div>
                      <label
                        form=""
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                      >
                        {errors.confirm && (
                          <p className="text-sm  text-orange-500">
                            تایید رمز ورود
                          </p>
                        )}
                        رمز ورود
                      </label>
                      <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        {...register("confirm", {
                          required: true,
                        })}
                      />
                    </div>

                    <div>
                      <label
                        form=""
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                      >
                        دسترسی
                      </label>
                      <select
                        {...register("roleuser")}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <option value="admin">admin</option>
                        <option value="user">user</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        form="description"
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                      >
                        توضیحات
                      </label>
                      <textarea
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="درباره من"
                        {...register("profile")}
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setErrormsg("")}
                      type="submit"
                      className="text-white bg-red-600 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      ایجاد
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </MuiModal>
    </>
  );
};

export default NewUser;
