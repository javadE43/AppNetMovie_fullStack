import { useState, CSSProperties, useEffect } from "react";

//module extra
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { Link, useNavigate, Outlet, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { Users, Movies, StateTypeAuth, Categories } from "../typeing";
import { modalCreateUser } from "../atoms/modalAtom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fatchUpdateMovies } from "../features/movies/movies";
import { fatchCategorysPublic } from "../features/categorys/category";

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
    user: Users | null;
    count: number;
    insert: number;
    isloading: boolean;
    ErrorMessage: string | null;
  };
}
interface MoviesType {
  movies: {
    movies: Movies[] ;
    Allmovie: Movies[] ;
    insert: number;
    update: number;
    delete: number;
    count:number 
    isLoading: boolean;
    ErrorMessage:string 
  };
}
interface Inputs {
  adult: string;
  backdrop_path: string;
  genre_ids: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: string;
  poster_path: string;
  release_date: string;
  title: string;
  video: string;
  vote_average: string;
  vote_count: string;
  media_type: string;
  movieid: string;
}
interface Cat {
  title: string;
  bits: number;
  image: string;
  content: string;
}
interface Categorys {
  categorys: {
    categorys: Categories[] ;
    categoryPublic: Categories[] ;
    update: number;
    delete: number;
    insert: number;
    count: number;
    isLoading: boolean;
    ErrorMassege: string;
  };
}
const UpdateMovie = () => {
  let [color, setColor] = useState("#ffffff");

  //state movie and category
  const [showModalCreateUser, setShowModalCreateUser] =
    useRecoilState(modalCreateUser);
  const categorys = useAppSelector(
    (state: Categorys) => state?.categorys?.categoryPublic
  );
  const movies = useAppSelector((state: MoviesType) => state?.movies);
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);

  //
  const [Errormsg, setErrormsg] = useState<string>("");
  const [startDate, setStartDate] = useState(new Date());
  const [movie, setMovie] = useState<Movies[]>([]);

  //
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxiosPrivate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const handleClose = () => {
    setShowModalCreateUser(!showModalCreateUser);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)
    const formData = new FormData();
    formData.append("adult", data.adult);
    if (data.adult == "") formData.delete("adult");
    formData.append("genre_ids", data.genre_ids);
    if (data.genre_ids == "") formData.delete("genre_ids");
    formData.append("original_language", data.original_language);
    if (data.original_language == "") formData.delete("original_language");
    formData.append("original_title", data.original_title);
    if (data.original_title == "") formData.delete("original_title");
    formData.append("overview", data.overview);
    if (data.overview == "") formData.delete("overview");
    formData.append("popularity", data.popularity);
    if (data.popularity == "") formData.delete("popularity");
    formData.append("poster_path", data.poster_path[0]);
    if(data.poster_path == null) formData.delete("poster_path")
    formData.append("release_date", startDate.toLocaleDateString());
    if (data.release_date == "") formData.delete("release_date");
    formData.append("title", data.title);
    if (data.title == "") formData.delete("title");
    formData.append("video", data.video);
    if (data.video == "") formData.delete("video");
    formData.append("vote_average", data.vote_average);
    if (data.vote_average == "") formData.delete("vote_average");
    formData.append("vote_count", data.vote_count);
    if (data.vote_count == "") formData.delete("vote_count");
    formData.append("media_type", data.media_type);
    if (data.media_type == "") formData.delete("media_type");
    // formData.append("movieid", data.movieid);
    // if(data.movieid == "") formData.delete("movieid")
    if (user?.userInfo && id)
      dispatch(
        fatchUpdateMovies({axiosPrivate, data:formData, movieid:Number(id),userid: user?.userInfo?.id})
      );
  };

  useEffect(() => {
    dispatch(fatchCategorysPublic());
  }, []);
  
  //
  useEffect(() => {
    if (movies?.movies && id) {
      const movie = movies?.movies.filter((M) => M.id === Number(id));
      setMovie(movie || []);
    }
  }, [movies?.movies]);

  //
  useEffect(() => {
    if(movies.update === 200){
      window.history.back()
  }
  }, [movies.update]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.1 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        className="p-4 overflow-x-auto relative shadow-md bg-[#f7f7f7] h-screen"
      >
        {/* <!-- Main modal --> */}
        <div className=" z-50 flex justify-center items-center w-full md:inset-0 h-auto md:h-auto">
          <div className="relative p-4 w-full h-full md:h-auto">
            {/* <!-- Modal content --> */}
            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <div className="flex justify-start m-1">
                <Link
                  to="/dashboard/editmovie/editcategory"
                  className="block text-white bg-red-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  ویرایش دسته بندی
                </Link>
              </div>
              {/* <!-- Modal body --> */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div className="flex justify-between items-center">
                    {/* <div className="col-span-full">
                      <label
                        className="block mb-2 text-sm font-medium text-black dark:text-black"
                        form="file_input"
                      >
                        عکس بزرگ
                      </label>
                      <input
                        className="block p-2 w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        type="file"
                        {...register("backdrop_path")}
                      />
                    </div> */}
                    <div className="col-span-full">
                      <label
                        className="block mb-2 text-sm font-medium text-black dark:text-black"
                        form="file_input"
                      >
                         تصویر
                      </label>
                      <input
                        className="block p-2 w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        type="file"
                        {...register("poster_path")}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      form=""
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      {errors.adult && (
                        <p className="text-sm  text-orange-500"></p>
                      )}
                      اسم کوتاه
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-red-400 focus:border-red-400 block w-full p-2.5 dark:bg-gray-700 dark:border-red-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-red-400 dark:focus:border-red-400"
                      placeholder={movie[0]?.title}
                      {...register("title")}
                    />
                  </div>
                  <div>
                    <label
                      form=""
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      {errors.original_title && (
                        <p className="text-sm  text-orange-500">
                          نام کامل فیلم
                        </p>
                      )}
                      اسم کامل فیلم
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder={movie[0]?.original_title}
                      {...register("original_title")}
                    />
                  </div>
                  <div>
                    <label
                      form=""
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      {errors.vote_average && (
                        <p className="text-sm  text-orange-500"></p>
                      )}
                      میانگین امتیاز
                    </label>
                    <input
                      type="number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-red-400 focus:border-red-400 block w-full p-2.5 dark:bg-gray-700 dark:border-red-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-red-400 dark:focus:border-red-400"
                      placeholder={`${movie[0]?.vote_average}`}
                      {...register("vote_average")}
                    />
                  </div>
                  <div>
                    <label
                      form=""
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      {errors.vote_count && (
                        <p className="text-sm  text-orange-500"></p>
                      )}
                      امتیاز
                    </label>
                    <input
                      type="number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-red-400 focus:border-red-400 block w-full p-2.5 dark:bg-gray-700 dark:border-red-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-red-400 dark:focus:border-red-400"
                      placeholder={`${movie[0]?.vote_count}`}
                      {...register("vote_count")}
                    />
                  </div>
                  <div>
                    <label
                      form=""
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      {errors.media_type && (
                        <p className="text-sm  text-orange-500"></p>
                      )}
                      نوع فیلم
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-red-400 focus:border-red-400 block w-full p-2.5 dark:bg-gray-700 dark:border-red-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-red-400 dark:focus:border-red-400"
                      placeholder={movie[0]?.media_type}
                      {...register("media_type")}
                    />
                  </div>
                  <div>
                    <label
                      form=""
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      {errors.adult && (
                        <p className="text-sm  text-orange-500">رده سنی بالا</p>
                      )}
                      رده سنی بالا
                    </label>
                    <select
                      {...register("adult")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="true">بالای18</option>
                      <option value="false">پایین18</option>
                    </select>
                  </div>
                  <div>
                    <label
                      form=""
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      {errors.popularity && (
                        <p className="text-sm  text-orange-500">بازدید</p>
                      )}
                      بازدید
                    </label>
                    <input
                      type="number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder={`${movie[0]?.popularity}`}
                      {...register("popularity", {})}
                    />
                  </div>

                  <div>
                    <label
                      form=""
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      تاریخ ساخت
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date) => setStartDate(date)}
                      className="text-black border-black w-full "
                    />
                  </div>
                  <div>
                    <label
                      form=""
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      زبان
                    </label>
                    <select
                      {...register("original_language")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="en">انگلیسی</option>
                      <option value="fn">فارسی</option>
                      <option value="lo">زبان اصلی</option>
                    </select>
                  </div>
                  <div>
                    <label
                      form=""
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      ویدئو
                    </label>
                    <select
                      {...register("video")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="true">دارد</option>
                      <option value="false">ندارد</option>
                    </select>
                  </div>
                  <div>
                    <label
                      form=""
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      دسته بندی
                    </label>
                    <select
                      {...register("genre_ids")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      {categorys?.map((item, i) => (
                        <option value={item?.bits}>{item?.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      form="description"
                      className="block mb-2 text-sm font-medium text-black dark:text-black"
                    >
                      توضیحات
                    </label>
                    <textarea
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder={movie[0]?.overview}
                      {...register("overview")}
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
      <Outlet />
    </>
  );
};

export default UpdateMovie;
