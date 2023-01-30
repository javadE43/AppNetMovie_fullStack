import { useState, CSSProperties } from "react";

//module external
import { useForm, SubmitHandler } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import MuiModal from "@mui/material/Modal";
import { HiXMark, HiOutlineXMark } from "react-icons/hi2";
import { useRecoilState } from "recoil";
import {
  modalAccount,
  payAccount,
} from "../atoms/modalAtom";

//

import { Users, Payment, StateTypeAuth } from "../typeing";
import { useAppSelector, useAppDispatch } from "../app/hooks";

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

interface Inputs {
  email: string;
  username: string;
  mobile: string;
}
interface Subscri {
  subscri: {
    payment: Payment[] | null;
    isloading: boolean;
  };
}
interface Props {
  data: {
    name: string;
    amount: number;
  };
}
const FormPay = ({ data }: Props) => {
  let [color, setColor] = useState("#ffffff");
  const [ShowmodalAccount, setShowmodalAccount] = useRecoilState(modalAccount);
  const [payaccount, setpayAccount] = useRecoilState(payAccount);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);
  const axiosPrivate = useAxiosPrivate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const handleClose = () => {
    setShowmodalAccount(!ShowmodalAccount);
  };
  const onSubmit: SubmitHandler<Inputs> = async (Data) => {
    if (user?.userInfo?.id) {
      const formData = new FormData();
      formData.append("username", Data.username);
      formData.append("account", data?.name);
      formData.append("mobile", Data.mobile);
      formData.append("email", Data.email);
     
    }
  };
  return (
    <>
      <MuiModal
        open={false}
        className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <ClipLoader
          color={color}
          loading={false}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </MuiModal>

      <MuiModal
        open={ShowmodalAccount}
        onClose={() => handleClose()}
        className="fixed  overflow-x-hidden !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <div>
          <div className="flex justify-center m-5">
            <span className="block text-white bg-red-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              خرید اشتراک
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
                    <HiOutlineXMark size={25} className="text-red-400" />
                    <span className="sr-only">بستن</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
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
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                            شماره موبایل را وارد کنید
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
                        نوع اکانت
                      </label>
                      <input
                        type="tel"
                        value={` خرید اشتراک ${
                          data?.name === "gold"
                            ? "طلایی"
                            : data.name === "Bronze"
                            ? "برنز"
                            : data.name === "silver"
                            ? "نقره ی"
                            : null
                        } : ${data?.amount} هزار تومان`}
                        disabled={true}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      className="text-white bg-red-600 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      خرید اشتراک
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </MuiModal>
    </>
  );
};

export default FormPay;
