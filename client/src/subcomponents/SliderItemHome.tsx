import React, { useState } from "react";

//module external
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-lazy-load-image-component/src/effects/blur.css';
//
import { Movies, StateTypeAuth } from "../typeing";
import { useAppSelector } from "../app/hooks";

//interface
interface Props {
  item: Movies;
}

const SliderItemHome = ({ item }: Props) => {
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);
  //
  const navigate = useNavigate();
 // 
  const handleShowMovie = (id: number | null) => {
    if (user?.userInfo?.username && id) {
      navigate(`/movie/${id}`);
    } else {
      toast("برای مشاهده فیلم در سایت ثبت نام کنید", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  };
  return (
    <>
       <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[100vh] w-full lg:justify-end lg:pb-12">
        <div className="absolute top-0 left-0 -z-10 h-[95vh] w-full">
          {item && (
            <img
            src={`${item?.poster_path}`}
            className="object-cover w-full"
            alt={`${item?.title}`}
            />
          )}
        </div>
        <div className="translate-y-2/4 translate-x-[-2px]">
          <h1 className="text-white text- text-2xl font-bold md:text-4xl lg:text-7xl xs:text-sm pr-3">
            {item?.title || item?.original_title}
          </h1>
          <p className=" text-white max-w-xs text-xs text-shadow-md md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl pr-3">
            {item?.overview.slice(0, 100)}
          </p>

          <div className="flex space-x-3 pr-3 my-4">
            <button
              className="btn text-sm ml-3"
              onClick={() => handleShowMovie(item?.id ? item?.id : null)}
            >
              {/* <FaPlay className=""size={25} /> */}
              تماشا
            </button>

            <button
              className="btn-outline mr-3"
              onClick={() => handleShowMovie(item?.id ? item?.id : null)}
            >
              {/* <HiOutlineInformationCircle className="h-5 w-5 md:h-8 md:w-8" /> */}
              جزئیات
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(SliderItemHome);
