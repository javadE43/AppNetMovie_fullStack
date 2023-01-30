import { useState, useEffect, CSSProperties, useCallback } from "react";
//module external
import { useForm, SubmitHandler } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import MoonLoader from "react-spinners/MoonLoader";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams} from "react-router-dom";
import { HiOutlineXMark } from "react-icons/hi2";
import MuiModal from "@mui/material/Modal";

//
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { Users, StateTypeAuth } from "../typeing";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fatchUpdateUsers } from "../features/users/users";


//interface
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

interface Inputs {
  email: string
  username: string
  mobile: string
  password: string
  roleuser: string
  profile: string
  image: string
  confirm:string
}

interface Props{
  path:string
}

//component
const EditUser = ({path}:Props) => {
  let [color, setColor] = useState("#ffffff");
  //modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [Errormsg, setErrormsg] = useState<string>("");
  const [user, setuser] = useState<Users[]>([]);
  //state user
  const stateUsers = useAppSelector((state: State) => state?.users);
  const auth = useAppSelector((state: StateTypeAuth) => state?.auth);
  //
  const {id} =useParams()
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
//handlecloseModal
  const handleClose = () => {
    setShowModal(false);
    window.history.back()
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (user?.[0] !== null) {
      const formData = new FormData();
      formData.append("image", data.image[0]);
      if(data.image.length == 0) formData.delete("image");
      formData.append("username",user?.[0]?.username);
      if(data.username == "") formData.delete("username");
      formData.append(
        "password",
        data.password 
      );
      if(data.password == "") formData.delete("password");
      formData.append(
        "confirm",
        data.confirm 
      );
      if(data.confirm == "") formData.delete("confirm");
      formData.append(
        "mobile",
        data.mobile 
      );
      if(data.mobile == "") formData.delete("mobile");
      formData.append(
        "email",
        data.email 
      );
      if(data.email == "") formData.delete("email");
      formData.append(
        "profile",
        data.profile 
      );
      if(data.profile == "") formData.delete("profile");
      formData.append(
        "roleuser",
        data.roleuser
      );
      if(!data.roleuser || data.roleuser == "") formData.delete("roleuser");
      if (id !== null && user ) {
        dispatch(fatchUpdateUsers({axiosPrivate, data:formData,id: Number(id)}));
      }
    }
  };
//
  const handleupdate = useCallback(() => {
      if (stateUsers?.update === 200 && id !== null) {
         window.history.back();
      }
  }, [stateUsers?.update]);
  //
  useEffect(() => {
 if (id !== null && stateUsers?.allusres ) {
      const user=stateUsers?.allusres?.filter(U =>U.id == Number(id))
      setuser(user || [])
      setShowModal(true)
    }
  }, []);
  //
  useEffect(() => {
    handleupdate();
  }, [stateUsers?.update]);
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
        open={stateUsers?.update === 102?true:stateUsers?.update===1?false:false}
        className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <MoonLoader
          color={"#36d7b7"}
          loading={stateUsers?.update === 102?true:stateUsers?.update===1?false:false}
          cssOverride={overrideupdate}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </MuiModal>

      <MuiModal
        open={showModal}
        onClose={() => handleClose()}
        className="fixed  overflow-x-hidden !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, x: 0, transition: { duration: 0.1 } }}
        >
          <div className="flex justify-center m-5">
            <span className="block text-white bg-red-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              ویرایش کاربر
            </span>
          </div>

          {/* <!-- Main modal --> */}
          <div className=" z-50 flex justify-center items-center w-full md:inset-0 h-modal md:h-full">
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
              {/* <!-- Modal content --> */}
              <div className="relative p-4 bg-[#1b2a4e] rounded-lg shadow dark:bg-gray-800 sm:p-5">
                {/* <!-- Modal header --> */}
                <div className="flex  pb-4 mb-4  justify-between items-center rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <div className="flex justify-between items-center rounded-t sm:mb-5">
                    <h3 className="text-lg font-semibold text-white dark:text-white">
                    بستن
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => handleClose()}
                  >
                    <HiOutlineXMark size={20} className="text-red-400" />
                    <span className="sr-only">بستن</span>
                  </button>
                    </div>
                    <div className="flex text-start items-start bg-red-400 py-1 px-4 border border-red-400 rounded-sm">
                      {user[0]?.roleuser =="admin"?"مدیر":user[0]?.roleuser =="user"?"کاربر":""}
                    </div>
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
                        ایمیل
                      </label>
                      <input
                        type="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder={user[0]?.email || ""}
                        {...register("email")}
                      />
                    </div>
                    <div>
                      <label
                        form=""
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                      >
                        موبایل
                      </label>
                      <input
                        type="tel"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder={user[0]?.mobile || ""}
                        {...register("mobile")}
                      />
                    </div>
                    <div>
                      <label
                        form=""
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                      >
                        رمز ورود
                      </label>
                      <input
                        type="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="435343@$%J"
                        {...register("password", {
                          pattern: /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])/,
                        })}
                      />
                    </div>
                    <div>
                      <label
                        form=""
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                      >
                       تایید رمز ورود
                      </label>
                      <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        {...register("confirm", {
                        })}
                      />
                    </div>
                    {auth?.userInfo?.role === "admin" ? (
                      <div>
                        <label
                          form=""
                          className="block mb-2 text-sm font-medium text-white dark:text-white"
                        >
                          دسترسی
                        </label>
                        <select
                          {...register("roleuser")}
                          className="bg-gray-50 border border-gray-300 text-block text-sm rounded-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option className="text-block" value="admin">admin</option>
                          <option className="text-block" value="user">user</option>
                        </select>
                      </div>
                    ) : null}
                    <div className="sm:col-span-2">
                      <label
                        form="description"
                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                      >
                        توضیحات
                      </label>
                      <textarea
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder={user[0]?.profile || ""}
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
                      ویرایش
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

export default EditUser;
