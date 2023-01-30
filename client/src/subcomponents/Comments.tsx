import { useEffect, useState, CSSProperties } from "react";

//module external

import { useForm, SubmitHandler } from "react-hook-form";
import * as timeago from "timeago.js/lib/index";
import MuiModal from "@mui/material/Modal";
import ClipLoader from "react-spinners/ClipLoader";
import {
  HiOutlineChatBubbleOvalLeftEllipsis,
  HiOutlineEllipsisHorizontal,
} from "react-icons/hi2";

//

import { CommentType, Movies, Ratings, StateTypeAuth, Users } from "../typeing";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fatchComments, fatchCommentsDelete, fatchCommentsInsert } from "../features/ratings/review";
import { fatchAllUsers } from "../features/users/users";

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

interface Props {
  ratings: number;
  newratings: number;
  movie: Movies;
}

interface Comment {
  review: {
    ratings: Ratings[];
    comment: CommentType[]
    insert: number 
    delete: number 
    isLoading: boolean;
    errorMessage: string;
  };
}
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
const Comments = ({ ratings, newratings, movie }: Props) => {
  let [color, setColor] = useState("#ffffff");
  const [collaps, setCollaps] = useState<boolean>(false);
  const [id, setId] = useState<number | null>(null);
  //COMMENTS
  const [comments, setComments] = useState<CommentType[]>([]);
  //
  const comment = useAppSelector((state: Comment) => state?.review);
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);
  const complateDataUser = useAppSelector((state: State) => state?.users?.allusres);
  //
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxiosPrivate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    if (user?.userInfo?.id && movie) {
      const dataComent = {
        movieid: movie?.id,
        userId: user?.userInfo?.id,
        username: user?.userInfo?.username,
        movietitle: movie?.title,
        content: data?.textarea,
        ratings: ratings + newratings,
        image:user?.userInfo?.image
      };
      dispatch(fatchCommentsInsert({data:dataComent, axiosPrivate}));
    }
  };
  //
  const handleOption = (id: number) => {
    setCollaps(!collaps);
    setId(id);
  };
  //
  const handleDeleteComment = (
    userid: number,
    movieid: number,
    movietitle: string,
    createdAt:any
  ) => {
    if (userid && movieid && createdAt){
      dispatch(fatchCommentsDelete({userid, movieid, movietitle,createdAt, axiosPrivate}));
    }
  };
  //
  useEffect(() => {
    if (movie?.id) {
      dispatch(fatchComments({movietitle:movie?.title, movieid:movie?.id, axiosPrivate}));
      dispatch(fatchAllUsers({ axiosPrivate }));

    }
  }, []);
  //
  useEffect(() => {
    if (comment?.comment) {
      setComments(comment?.comment);
    }
  }, [comment?.comment]);
  return (
    <>
      <MuiModal
        open={comment?.isLoading}
        className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <ClipLoader
          color={color}
          loading={comment?.isLoading}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </MuiModal>
      <section className="bg-[#181818] dark:bg-gray-900 py-8 lg:py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-white dark:text-white">
              نظرات
            </h2>
          </div>
          <form className="mb-6 sticky top-0 bottom-0 right-0 left-0 h-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <label form="comment" className="sr-only">
                نظر شما
              </label>
              <textarea
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                {...register("textarea", {
                  max: 1000,
                  min: 0,
                  maxLength: 1000,
                })}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 border border-white border-solid hover:bg-blue-400"
            >
              ثبت کامنت
            </button>
          </form>
          <div className=" overflow-hidden overflow-y-scroll !scrollbar-thin !scrollbar-track-transparent !scrollbar-thumb-blue-700">
            <div className="h-full">
              {comments.length > 0 &&
                comments.map((com, i) => (
                  <article
                    key={i}
                    className="p-6 mb-4 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white ml-2">
                          <img
                            className="mr-2 w-6 h-6 rounded-full"
                            src={`${com?.image}`}
                            alt="Helene Engels"
                          />
                          {com?.username}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            {timeago.format(com?.createdAt || "2022-10-25")}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className=" break-all overflow-hidden text-gray-500 dark:text-gray-400">
                      {com?.content}
                    </p>
                    <div className="flex items-center justify-between mt-4 space-x-4">
                      <button
                        type="button"
                        className="flex  items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
                      >
                        <HiOutlineChatBubbleOvalLeftEllipsis size={20} />
                        پاسخ
                      </button>
                      <div className=" flex justify-between z-10 w-36 bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600">
                        <ul
                          className={`flex absolute translate-x-[-35%] left-1/2 py-1 text-sm text-gray-700 dark:text-gray-200 ${
                            i === id ? "visible" : "invisible"
                          }`}
                          aria-labelledby="dropdownMenuIconHorizontalButton"
                        >
                          <li>
                            <a
                              href="#"
                              className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              ویرایش
                            </a>
                          </li>
                          {com.userId == user?.userInfo?.id ? (
                            <li>
                              <button
                                onClick={() =>
                                  handleDeleteComment(
                                    com.userId,
                                    com.movieid,
                                    com.movietitle,
                                    com.createdAt
                                  )
                                }
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                حذف
                              </button>
                            </li>
                          ):null}
                          <li>
                            <a
                              href="#"
                              className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              گزارش
                            </a>
                          </li>
                        </ul>
                      </div>
                      <button
                        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        onClick={() => handleOption(i)}
                        
                      >
                        <HiOutlineEllipsisHorizontal size={25} />
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Comments;
