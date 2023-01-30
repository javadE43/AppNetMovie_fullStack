import { useCallback, useEffect, useRef, useState, CSSProperties } from "react";

//module extra
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";

//

import { Movies, StateTypeAuth, Userinfo } from "../typeing";
import { fatchLogin, removeMessage } from "../features/auth/auth";
import { useAppSelector,useAppDispatch } from "../app/hooks";

//interface
interface Inputs {
  username: string;
  password: string;
}
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#4f46e5",
};
interface MovieType {
  movies: { movie: Movies[]; isloading: boolean };
}
//component
function Login() {
  let [color, setColor] = useState("#ffffff");
  const [login, setLogin] = useState<boolean>(false);
  const settimeRef = useRef<NodeJS.Timeout | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [movie, setMovie] = useState<Movies | null>(null);
  // const banner = useSelector((state: MovieType) => state?.movies.movie);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  
  //dispatch
  // const dispatch: Dispatch<any> = useDispatch();
  const dispatch= useAppDispatch();
  const navigate = useNavigate();

  //stateRedux
  // const loginState = useSelector((state: StateTypeAuth) => state?.auth);
  const auth = useAppSelector((state:StateTypeAuth) => state.auth);
  //loginfatch
  const onSubmit: SubmitHandler<Inputs> = (data) => {

    // dispatch(loginAction(data?.username, data?.password));
    dispatch(fatchLogin(data))
  };

  //useCallback
  const checkLogin = useCallback(() => {
    if (auth?.errorMessage !== null && !auth?.accessToken) {
      setErrorMsg(auth?.errorMessage);
      settimeRef.current = setTimeout(() => {
        setErrorMsg("");
      }, 2000);
    }
    if (!auth?.errorMessage  && auth?.accessToken) {
      setErrorMsg("");
      navigate("/");
      dispatch(removeMessage())
    }
  }, [auth?.isLoading]);
//useEffect

  useEffect(() => {
    checkLogin();
    return () => clearTimeout(settimeRef?.current as NodeJS.Timeout);
  }, [auth?.isLoading]);

  //
  useEffect(() => {
    dispatch(removeMessage())
  }, []);
//
  // useEffect(() => {
  //   setMovie(banner?.[Math.floor(Math.random() * banner.length)]);
  // }, [banner]);

//return
  return (
    <motion.div
      className="relative flex w-screen flex-col md:items-center md:justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1,transition: { duration: 0.3 }}}
      exit={{ opacity: 0,transition: { duration: 0.1 }}}
    >
      <div className="relative grid bg-black w-full">
        <div className="h-screen flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-top md:bg-top bg-login-poster">
          <div className="h-screen md:flex md:items-center md:justify-left w-full sm:w-auto md:h-full xl:w-1/2 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none ">
            <div className="max-w-xl w-full space-y-12">
              <div className="lg:text-left text-center">
                <div className="flex items-center justify-center ">
                  <div className=" flex flex-col w-80 border border-indigo-600 rounded-lg px-8 py-10">
                    <span className="text-red-400 text-center">{errorMsg}</span>
                    <h1 className="text-4xl font-semibold text-center text-red-400">
                      ورود
                    </h1>
                    <form
                      className="flex flex-col space-y-2 mt-10"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <label className="font-bold text-lg text-white text-center md:text-right">
                        نام کاربری
                      </label>
                      <input
                        type="text"
                        placeholder="نام کاربری "
                        className="border rounded-lg py-3 px-3 bg-transparent border-indigo-600 placeholder-white-500 text-white"
                        {...register("username", { required: true })}
                      />
                      {errors.username && (
                        <p className="text-sm  text-orange-500 text-center md:text-right">
                          نام کاربری خود را وارد کنید
                        </p>
                      )}
                      <label className="font-bold text-lg text-white text-center md:text-right">
                        رمز ورود
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
                      <div className="text-[gray] text-center">
                        اکانت جدید?{" "}
                        <Link
                          to="/register"
                          className="cursor-pointer text-white hover:underline"
                        >
                          ثبت نام
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
                          onClick={() => setLogin(!login)}
                          type="submit"
                        >
                          ورود
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
