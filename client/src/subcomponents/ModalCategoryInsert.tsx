
import { useState,CSSProperties,useEffect} from "react";

//module extra
import { useForm, SubmitHandler } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";
import MuiModal from "@mui/material/Modal";
import { HiOutlineXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import MoonLoader from "react-spinners/MoonLoader";


//
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { Users,StateTypeAuth, Categories } from "../typeing";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fatchInsertCategory } from "../features/categorys/category";

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

interface Inputs {
  title: string;
  content: string;
  image: string;
}
interface Cat {
  title: string;
  image: string;
  content: string;
  bits: number;
  username: string;
  createdAt: string;
  updatedAt: string;
}
interface Categorys {
  categorys: {
    categorys: Categories[];
    categoryPublic: Categories[];
    count: number;
    update: number;
    delete: number;
    insert: number;
    isLoading: boolean;
    ErrorMassege: string ;
  };
}
//component
const InsertCategoryModal = () => {

  //
  let [color, setColor] = useState("#ffffff");

  //
  const [showModalInsertCategory, setShowModalInsertCategory] =useState<boolean>(false);
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);
  const categorys = useAppSelector((state: Categorys) => state?.categorys);

  //
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  // close modal
  const handleClose = () => {
    setShowModalInsertCategory(false);
    window.history.back();
  };

  // create category
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let Bits = JSON.stringify(Math.floor( Math.random() * (1000 - 1) ) + 50);
    const formData = new FormData();
    formData.append("image", data.image[0]);
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("bits",Bits);
    if(user?.userInfo?.id){
    dispatch(fatchInsertCategory({axiosPrivate,data:formData,userid:user?.userInfo?.id,}));
    }
  };
  
  // change state showmodal
  useEffect(() => {
    setShowModalInsertCategory(true)
  }, [])
  //return
  return (
    <>
      <MuiModal
        open={true}
        className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <ClipLoader
          color={"#36d7b7"}
          loading={true}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </MuiModal>
      <MuiModal
        open={categorys?.isLoading?true:false}
        className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <MoonLoader
          color={"#36d7b7"}
          loading={categorys?.isLoading?true:false}
          cssOverride={overrideupdate}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </MuiModal>
      <MuiModal
        open={showModalInsertCategory}
        onClose={() => handleClose()}
        className="fixed  overflow-x-hidden !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <motion.div
          initial={{ y: window.innerHeight, }}
          animate={{ y: 0,transition: { duration: 0.1 } }}
          exit={{ y: window.innerHeight,transition: { duration: 0.1 } }}
        >
          <div className="flex justify-center m-5">
            <span className="block text-white bg-red-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              ایجاد دسته بندی جدید
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
                        {errors.title && (
                          <p className="text-sm  text-orange-500">
                            عنوان دسته بندی
                          </p>
                        )}
                        عنوان
                      </label>
                      <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="گلرن"
                        {...register("title")}
                      />
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
                        placeholder=" "
                        {...register("content")}
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      // onClick={() => setErrormsg("")}
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

export default InsertCategoryModal;
