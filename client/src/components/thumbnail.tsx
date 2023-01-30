//module external
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {LazyLoadImage} from "react-lazy-load-image-component"
import 'react-lazy-load-image-component/src/effects/blur.css';
import { FaPlay } from "react-icons/fa";

//
import { Movies, StateTypeAuth} from "../typeing";
import { useAppSelector } from "../app/hooks";

//interface
interface Props {
  movie: Movies | null;
  category:number
}
//component
function Thumbnail({ movie,category }: Props) {
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);
  const navigate = useNavigate();
  const handleShowMovie = () => {
    if (user?.userInfo?.username && movie) {
      navigate(`movie/${category===1?movie.movieid:movie.id}`);
    } else {
      toast("برای مشاهده فیلم در سایت ثبت نام کنید", {
        position: "bottom-left",
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
      <div
        className={`relative overflow-hidden cursor-pointer rounded-2xl transition duration-200 ease-out md:hover:scale-101`}
        onClick={() => handleShowMovie()}
      >
        <div className="transition rounded-2xl h-full w-full ease-in-out absolute top-0 left-0 bottom-0 right-0 z-50 flex justify-center items-center opacity-0 -translate-y-100 -z-1  hover:translate-y-0 duration-700 hover:z-40 duration-100 hover:opacity-100 duration-100">
        <button className="btn btn-sm relative z-40"><FaPlay/></button>
        <div className="absolute bottom-0 text-red-600 z-40 font-bold flex justify-center items-center"><h3>{movie?.title}</h3></div>
        <div className="absolute z-30 top-0 left-0 bottom-0 right-0 rounded-2xl  h-full w-full opacity-80 bg-black"></div>
        </div>
        <LazyLoadImage
          src={`${movie?.poster_path}`}
          className="img-lazy rounded-2xl h-full"
          alt={`${movie?.title}`}
          placeholderSrc={`${movie?.title}`}
          effect="blur"
          />
      </div>
    </>
  );
}

export default Thumbnail;
