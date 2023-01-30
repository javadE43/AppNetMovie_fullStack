import { useState } from "react";

//module extr
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { motion } from "framer-motion";

//
import { modalAccount } from "../atoms/modalAtom";
import FormPay from "./FormPay";

//interface
interface Inputs {
  email: string;
  fullname: string;
  phone: string;
  password: string;
}
interface AccountItem {
  name: string;
  amount: number;
}

//component
const Account = () => {
  const [ShowmodalAccount, setShowmodalAccount] = useRecoilState(modalAccount);
  const [newAccount, setNewAccount] = useState<AccountItem | null>(null);
  const [Errormsg, setErrormsg] = useState<string>("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const Items: AccountItem[] = [
    { name: "gold", amount: 300 },
    { name: "silver", amount: 200 },
    { name: "Bronze", amount: 100 },
  ];
  const handleAccount = (title: string) => {
    const newAc = Items.find((item) => item?.name === title);
    if (newAc !== undefined) {
      setNewAccount(newAc);
      setShowmodalAccount(!ShowmodalAccount);
    }
  };

  return (
    <motion.div
    initial={{width:0}}
    animate={{width:"100%"}}
    exit={{x:window.innerWidth}}
    >
      <section className="container m-auto">
        <div className="text-center my-10">
          <h1 className="font-bold text-3xl mb-2">خرید اشتراک</h1>
          <h4 className="text-gray-600">
            تماشای تمامی فیلم ها وسریال های دنیا
          </h4>
        </div>

        <div className="flex justify-around flex-col md:flex-row px-2 md:px-0">
          <div className="w-full md:w-1/4 bg-gray-400 rounded-lg shadow hover:shadow-xl transition duration-100 ease-in-out p-6 md:mr-4 mb-10 md:mb-0">
            <h3 className="text-gray-600 text-lg">برنز</h3>
            <p className="text-gray-600 mt-1">
              <span className="font-bold text-black text-4xl">100</span> /ماه
            </p>
            <p className="text-sm text-gray-600 mt-2">برای تمامی فیلم ها</p>
            <div className="text-sm text-gray-600 mt-4">
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> سریال ها
              </p>
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> کمدی
              </p>
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> تائتر
              </p>
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> پخش زنده
              </p>
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> قابلیت
                استفاده برای یک کاربر
              </p>
            </div>
            <button
              className="w-full text-purple-700 border border-purple-700 rounded hover:bg-purple-700 hover:text-white hover:shadow-xl transition duration-150 ease-in-out py-4 mt-4"
              onClick={() => handleAccount("Bronze")}
            >
              خرید اشتراک
            </button>
          </div>
          <div className="w-full md:w-1/4 text-white bg-purple-700 rounded-lg shadow hover:shadow-xl transition duration-100 ease-in-out p-6 md:mr-4 mb-10 md:mb-0">
            <h3 className="text-lg">نقره ی</h3>
            <p className="mt-1">
              <span className="font-bold text-4xl">200</span> /ماه
            </p>
            <p className="text-sm opacity-75 mt-2">برای تمامی فیلم ها</p>
            <div className="text-sm mt-4">
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> سریال ها
              </p>
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> کمدی
              </p>
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> تائتر
              </p>
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> پخش زنده
              </p>
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> قابلیت
                استفاده برای 2 کاربر
              </p>
            </div>
            <button
              className="w-full text-purple-700 bg-white rounded opacity-75 hover:opacity-100 hover:shadow-xl transition duration-150 ease-in-out py-4 mt-4"
              onClick={() => handleAccount("silver")}
            >
              خرید اشتراک
            </button>
          </div>
          <div className="w-full md:w-1/4 bg-yellow-600 rounded-lg shadow hover:shadow-xl transition duration-100 ease-in-out p-6 mb-10 md:mb-0">
            <h3 className="text-gray-600 text-lg">طلایی</h3>
            <p className="text-gray-600 mt-1">
              <span className="font-bold text-black text-4xl">300</span> /ماه
            </p>
            <p className="text-sm text-gray-600 mt-2">برای تمامی فیلم ها</p>
            <div className="text-sm text-gray-600 mt-4">
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> کمدی
              </p>
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> تائتر
              </p>
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> پخش زنده
              </p>
              <p className="my-2">
                <span className="fa fa-check-circle mr-2 ml-1"></span> قابلیت
                استفاده برای 2 کاربر
              </p>
            </div>
            <button
              className="w-full text-purple-700 border border-purple-700 rounded hover:bg-purple-700 hover:text-white hover:shadow-xl transition duration-150 ease-in-out py-4 mt-4"
              onClick={() => handleAccount("gold")}
            >
              خرید اشتراک
            </button>
          </div>
        </div>
      </section>
      {ShowmodalAccount && newAccount ? <FormPay data={newAccount} /> : null}
    </motion.div>
  );
};

export default Account;
