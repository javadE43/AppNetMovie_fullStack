import { useState, CSSProperties } from "react";

//module external
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";

//
import { useAppSelector,useAppDispatch } from "../app/hooks";
import { fatchRegister } from "../features/auth/auth";
import { StateTypeAuth } from "../typeing";

//interface
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#4f46e5",
};

interface Inputs {
  email: string
  username: string
  mobile: string
  password: string
  confirm:string
}
//component
function Register() {
  let [color, setColor] = useState("#ffffff");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  //stateRedux
  const auth = useAppSelector((state:StateTypeAuth) => state.auth);
  const dispatch= useAppDispatch();

  //fatchRegister
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(fatchRegister(data))
  };

  return (
    <motion.div
      className="relative flex h-screen w-screen flex-col md:items-center md:justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1,transition: { duration: 0.3 }}}
      exit={{ opacity: 0,transition: { duration: 0.1 }}}
    >
      <div className="relative grid bg-black w-full">
        <div className="h-screen flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-top md:bg-top bg-login-poster">
          <div className="h-screen md:flex md:items-center md:justify-left w-full sm:w-auto md:h-full xl:w-1/2 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none ">
            <div className="max-w-xl w-full space-y-12">
              <div className="lg:text-left text-center">
                <div className="flex items-center justify-center w-full">
                  <div className=" flex flex-col w-full border border-indigo-600 rounded-lg px-8 py-10">
                    <span className="text-red-400 text-center">{auth?.errorMessage}</span>
                    <h1 className="text-4xl font-semibold text-center text-red-400">
                      ثبت نام
                    </h1>
                    <form
                      className="flex flex-col space-y-2 mt-10"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="flex justify-between flex-col md:flex-row ">
                        <div className="flex flex-col ">
                          <label className="font-bold text-lg text-white text-center md:text-right">
                            نام کاربری
                          </label>
                          <input
                            type="text"
                            placeholder="golren "
                            className="border rounded-lg py-3 px-3 bg-transparent border-indigo-600 placeholder-white-500 text-white"
                            {...register("username", { required: true })}
                          />
                          {errors.username && (
                        <p className="text-sm  text-orange-500 text-center md:text-right">
                        نام کاربری خود را وارد کنید
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <label className="font-bold text-lg text-white text-center md:text-right">
                            موبایل
                          </label>
                          <input
                            type="text"
                            placeholder="09367394353 "
                            className="border rounded-lg py-3 px-3 bg-transparent border-indigo-600 placeholder-white-500 text-white"
                            {...register("mobile", { required: true })}
                          />
                          {errors.mobile && (
                        <p className="text-sm  text-orange-500 text-center md:text-right">
                        شماره موبایل خود را وارد کنید
                            </p>
                          )}
                        </div>
                      </div>
                      <label className="font-bold text-lg text-white text-center md:text-right">
                        ایمیل
                      </label>
                      <input
                        type="email"
                        placeholder=" golren@gmail.com "
                        className="border rounded-lg py-3 px-3 bg-transparent border-indigo-600 placeholder-white-500 text-white"
                        {...register("email", { required: true,maxLength:50 })}
                        />
                        {errors.email && (
                        <p className="text-sm  text-orange-500 text-center md:text-right">
                        ایمیل خود را وارد کنید</p>
                        )}
                      <label className="font-bold text-lg text-white text-center md:text-right">
                       (1-9(@$%)(A-Z)) رمز ورود
                      </label>
                      <input
                        type="password"
                        placeholder="J1234@$%"
                        className="border rounded-lg py-3 px-3 bg-transparent border-indigo-600 placeholder-white-500 text-white"
                        {...register("password", { required: true })}
                      />
                      {errors.password && (
                        <p className="text-sm  text-orange-500 text-center md:text-right">
                        پسورد نمیتواند کمتر از 4 کاراکتر باشد
                        </p>
                      )}
                      <label className="font-bold text-lg text-white text-center md:text-right">
                       تایید رمز ورود
                      </label>
                      <input
                        type="password"
                        className="border rounded-lg py-3 px-3 bg-transparent border-indigo-600 placeholder-white-500 text-white"
                        {...register("confirm", { required: true })}
                      />
                      {errors.confirm && (
                        <p className="text-sm  text-orange-500 text-center md:text-right">
                        پسورد نمیتواند کمتر از 4 کاراکتر باشد
                        </p>
                      )}
                      <div className="text-[gray] text-center">
                        ثبت نام کردم?{" "}
                        <Link
                          to="/login"
                          className="cursor-pointer text-white hover:underline"
                        >
                          وارد شوید
                        </Link>
                      </div>
                      {auth?.isLoading ? (
                        <ClipLoader
                          color={color}
                          loading={auth?.isLoading}
                          cssOverride={override}
                          size={50}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      ) : (
                        <button
                          className="border border-indigo-600  text-white rounded-lg py-3 font-semibold"
                          type="submit"
                        >
                          ثبت نام
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="relative sm:w-1/1 xl:w-3/5 bg-transparent h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden  text-white bg-no-repeat bg-cover relative"
            // style={{
            //   backgroundImage: `url(${movie?.backdrop_path || movie?.poster_path})`,
            // }}
          >
            <div className="absolute opacity-25 inset-0 z-0"></div>
            <div className="w-full  lg:max-w-2xl md:max-w-md z-10 items-center text-center ">
              <div className=" font-bold leading-tight mb-6 mx-auto w-full content-center items-center "></div>
            </div>
          </div>
        </div>
      </div>
      {auth?.message && <Navigate to="/login" />}
    </motion.div>
    
  );
}

export default Register;
