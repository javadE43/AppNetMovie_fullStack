import { useCallback, useEffect, useState, CSSProperties } from "react";

//module external
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import ReactPlayer from "react-player/lazy";
import { FaPlay } from "react-icons/fa";
import { HiOutlineCheck } from "react-icons/hi";
import { BsPlus } from "react-icons/bs";
import { BsHandThumbsUpFill } from "react-icons/bs";
import MuiModal from "@mui/material/Modal";
import toast, { Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {LazyLoadImage} from "react-lazy-load-image-component"
import 'react-lazy-load-image-component/src/effects/blur.css';
//
import {
  Element,
  Genre,
  Movies,
  Userinfo,
  CommentType,
  Ratings,
  StateTypeAuth,
} from "../typeing";

import { modalMylist, modalState, movieState } from "../atoms/modalAtom";
import { BsX } from "react-icons/bs";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import Comments from "../subcomponents/Comments";
import { BASE_URL } from "../axios/configApi";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fatchInsertRating, fatchRetings } from "../features/ratings/review";
import {
  fatchDeleteMylist,
  fatchmylistInsert,
} from "../features/mylist/mylist";

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
const toastStyle = {
  background: "white",
  color: "black",
  fontWeight: "bold",
  fontSize: "16px",
  padding: "15px",
  borderRadius: "9999px",
  maxWidth: "1000px",
};
interface Mylist {
  mylist: {
    mylist: Movies[] 
    count: number
    delete: number
    insert: number
    isLoading: boolean
    ErrorMessage:string
  };
}

interface RatingsState {
  review: {
    ratings: Ratings[];
    comment: CommentType[];
    insert: number;
    delete: number;
    isLoading: boolean;
    errorMessage: string;
  };
}
interface MoviesType {
  movies: {
    movies: Movies[];
    Allmovie: Movies[];
    insert: number;
    update: number;
    delete: number;
    count: number;
    isLoading: boolean;
    ErrorMessage: string;
  };
}
//component
function Modal() {
  let [color, setColor] = useState("#ffffff");
  const [modal, setModal] = useState<boolean>(false);

  const [showmylist, setShowMylist] = useRecoilState(modalMylist);
  const [trailer, setTrailer] = useState("");
  const [rated, setRated] = useState<boolean>(false);
  const [muted, setMuted] = useState(true);
  //stateMovie
  const [movie, setMovie] = useState<Movies | null>(null);
  //showmovie
  const [play, setPlay] = useState<boolean>(false);
  const [loadingMovie, setLoadingMovie] = useState<boolean>(false);
  const [errorMoviePlay, setErrorMoviePlay] = useState<string>("");
  const [ratings, setRatings] = useState<number>(0);
  const [showCament, setShowCament] = useState<boolean>(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [addedToList, setAddedToList] = useState(false);
  const [movies, setMovies] = useState<null | Movies>(null);
  //
  // state redux
  const stateRatings = useAppSelector((state: RatingsState) => state?.review);
  const mylist = useAppSelector((state: Mylist) => state?.mylist);
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);
  const allMovies = useAppSelector(
    (state: MoviesType) => state?.movies?.Allmovie
  );
  //
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  //
  async function fetchMovie() {
    try {
      const data = await axiosPrivate.get(
        `${BASE_URL}/movies/movie?movieid=${movie?.movieid}&type=${
          movie?.media_type || "movie"
        }`
      );
      if (data.data?.data?.videos) {
        const index = data?.data?.data?.videos.results.findIndex(
          (element: Element) => element.type === "Trailer"
        );
        setTrailer(data?.data?.data.videos?.results[index]?.key);
      }
      if (data.data?.data?.genres) {
        setGenres(data.data?.data?.genres);
      }
      setLoadingMovie(false);
    } catch (error) {
      setErrorMoviePlay("Network Error");
      setLoadingMovie(false);
    }
  }
  useEffect(() => {
    setErrorMoviePlay("");
    setLoadingMovie(true);
    if (movie && play) {
      fetchMovie();
    }
  }, [play]);

  const handleClose = () => {
    setMovie(null);
    setShowMylist(!showmylist);
    toast.dismiss();
    setModal(false);
    window.history.back();
  };

  //   // Find all the movies in the user's list
  const mylistdata = useCallback(() => {
    if (user?.accessToken && user?.userInfo?.id) {
      const dublicate = mylist?.mylist?.find(
        (item: Movies) => item.id === movie?.id
      );
      if (dublicate !== undefined) {
        setMovies(dublicate);
        setAddedToList(true);
      } else {
        setAddedToList(false);
        setMovies(null);
      }
    }
  }, [id]);

  const getRatingsAll = useCallback(() => {
    if (movie?.title) {
      dispatch(fatchRetings({ movietitle: movie.title, axiosPrivate }));
    }
  }, [movie, rated]);

  const handlechakRatings = useCallback(() => {
    if (user?.userInfo?.id && stateRatings?.ratings?.length >= 0) {
      const dublicate = stateRatings.ratings.find((item: Ratings) => {
        if (
          item.userId === user?.userInfo?.id &&
          item.movietitle === movie?.title
        ) {
          return item;
        }
      });
      if (dublicate !== undefined && dublicate?.ratings !== null && movie) {
        setRatings(movie?.vote_count);
        setRated(true);
      } else {
        setRated(false);
      }
    }
  }, [movie, rated, stateRatings.isLoading]);

  //   // Check if the movie is already in the user's list

  const handleList = () => {
    if (
      movies !== null &&
      user?.userInfo?.id !== undefined &&
      addedToList === true
    ) {
      if (movies && user?.userInfo) {
        dispatch(
          fatchDeleteMylist({
            axiosPrivate,
            userid: user.userInfo.id,
            movieid: movies?.id,
          })
        );
      }
      setAddedToList(false);
      toast(`${movie?.title || movie?.original_title} از لیست شما حذف شد`, {
        duration: 8000,
        style: toastStyle,
      });
      setAddedToList(false);
    } else if (movie && addedToList === false) {
      const movieAdd = { ...movie, username: user?.userInfo?.username };
      setAddedToList(true);
      dispatch(fatchmylistInsert({ movie: movieAdd, axiosPrivate }));
      toast(`${movie?.title || movie?.original_title} به لیست شما اضافه شد`, {
        duration: 8000,
        style: toastStyle,
      });
    }
  };

  const handleRatings = () => {
    if (movie) {
      const movieItem = {
        adult: movie?.adult,
        backdrop_path: movie?.backdrop_path,
        genre_ids: movie?.genre_ids,
        id: movie?.id,
        original_language: movie?.original_language,
        original_title: movie?.original_title,
        overview: movie?.overview,
        popularity: movie?.popularity,
        poster_path: movie?.poster_path,
        release_date: movie?.release_date,
        title: movie?.title,
        video: movie?.video,
        vote_average: movie?.vote_average,
        vote_count: movie?.vote_count,
        media_type: movie?.media_type,
        movieid: movie?.movieid,
        username: movie?.username,
        userid: movie?.userid,
        roleuser: movie?.roleuser,
        createdAt: movie?.createdAt,
      };
      if (movie?.original_title && rated === false && user?.userInfo?.id) {
        const Ratings: Ratings = {
          username: user?.userInfo?.username,
          movietitle: movie?.original_title,
          ratings: movie?.vote_count + 1,
          userId: user?.userInfo?.id,
        };
        setMovie({ ...movieItem, vote_count: Ratings?.ratings });
        dispatch(
          fatchInsertRating({
            rated: Ratings,
            data: { ...movieItem, vote_count: Ratings?.ratings },
            movietitle: movie?.title,
            movieid: movie?.id,
            userid: user?.userInfo?.id,
            axiosPrivate,
          })
        );
        setRatings(Ratings?.ratings);
        setRated(!rated);
      } else if (
        movie?.original_title &&
        rated === true &&
        user?.userInfo?.id
      ) {
        const Ratings: Ratings = {
          username: user?.userInfo?.username,
          movietitle: movie?.original_title,
          ratings: movie?.vote_count - 1,
          userId: user?.userInfo?.id,
        };
        setMovie({ ...movieItem, vote_count: Ratings?.ratings });
        dispatch(
          fatchInsertRating({
            rated: Ratings,
            data: { ...movieItem, vote_count: Ratings?.ratings },
            movietitle: movie?.title,
            movieid: movie?.id,
            userid: user?.userInfo?.id,
            axiosPrivate,
          })
        );
        setRatings(Ratings?.ratings);
        setRated(!rated);
      }
    }
  };

  useEffect(() => {
    getRatingsAll();
    mylistdata();
    handlechakRatings();
  }, [movie]);
  //
  useEffect(() => {
    setModal(true);
  }, []);
  //
  useEffect(() => {
    handlechakRatings();
  }, [stateRatings?.isLoading]);
  //
  useEffect(() => {
    if (id) {
      const m = allMovies?.filter((item) => item.id === Number(id));
      if (m.length > 0 && m) setMovie(m[0]);
    }
  }, [id,allMovies]);
  return (
    <>
      <MuiModal
        open={stateRatings?.isLoading}
        className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <ClipLoader
          color={color}
          loading={stateRatings?.isLoading}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </MuiModal>

      <MuiModal
        open={modal}
        onClose={handleClose}
        className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <>
          <Toaster position="bottom-center" />
          <button
            className="btn z-50 absolute right-4 top-3 text-[7px] md:text-xs h-5 w-5 md:h-9 md:w-9 rounded-[100%] p-0"
            onClick={handleClose}
          >
            <BsX className="h-6 w-6 text-white relative z-50" />
            خروج
          </button>

          <div className="relative pt-[56.25%] overflow-hidden">
            <>
              {play ? (
                <>
                  {errorMoviePlay ? (
                    <div className="absolute inset-y-0 h-full w-full text-center text-black bg-white flex items-center justify-center">
                      {errorMoviePlay}
                    </div>
                  ) : (
                    <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${trailer}`}
                      width="100%"
                      height="100%"
                      style={{ position: "absolute", top: "0", left: "0" }}
                      playing
                      loop
                      controls
                      volume={1}
                      light={true}
                      muted={muted}
                    />
                  )}
                </>
              ) : (
                <div
                  className=" flex justify-between  w-full bg-cover bg-no-repeat absolute inset-y-0 h-full"
                  style={{
                    backgroundImage: `url(${movie?.poster_path})`,
                  }}
                >
                  <div className=" relative z-40 flex-1 w-32 rounded-3xl py-4 px-4">
                    <div
                      className="w-full h-full rounded-3xl overflow-hidden py-4 px-4 my-2"
                    >
                    <LazyLoadImage
                              src={`${movie?.poster_path}`}
                              className="img-lazy rounded-2xl h-auto max-w-full"
                              placeholderSrc={`${movie?.title}`}
                              effect="blur"
                       />
                    </div>
                  </div>
                  <div className="relative z-30 flex flex-col items-center justify-center flex-auto w-40 overflow-hidden">
                    <h3 className="font-bold text-sm md:text-lg lg:text-lg mb-4 text-white">{movie?.title}</h3>
                    <p className="text-sm md:text-lg lg:text-lg">
                      {movie?.overview}
                    </p>
                  </div>
                  <div className="z-20 absolute top-0 bottom-0 right-0 left-0 h-full w-full bg-black opacity-70"></div>
                </div>
              )}
            </>
            <div className="absolute bottom-10 flex w-full items-center justify-between px-10"></div>
          </div>
          <div className="flex flex-col space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
            <div className="space-y-6 text-lg">
              <div className="p-2">
                <h3>{movie?.title || movie?.original_title}</h3>
              </div>
              <div>
                <div className="flex justify-around space-x-2 p-4 border border-white border-solid rounded-md justify-center w-auto lg:w-[30%] md:w-[50%]">
                  <button
                    onClick={() => setPlay(!play)}
                    className="btn btn-sm gap-x-2 ml-4 p-0 px-4 text-xl transition hover:bg-[#e6e6e6] "
                  >
                    <FaPlay className="h-7 w-7 text-white" />
                    {play ? "خروج" : "تماشا"}
                  </button>
                  <button
                    className="mr-4 modalButton "
                    onClick={() => handleList()}
                  >
                    {addedToList ? (
                      <HiOutlineCheck className="h-7 w-7" />
                    ) : (
                      <BsPlus className="h-7 w-7" />
                    )}
                  </button>
                  <button
                    className="modalButton"
                    onClick={() => handleRatings()}
                  >
                    <BsHandThumbsUpFill
                      className={`h-6 w-6 ${rated ? "text-blue-400" : null}`}
                    />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                {/* <p className="font-semibold text-green-400">
                {movie!.vote_average * 10}% Match
              </p> */}
                <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">
                  تاریخ:<p className="font-light">{movie?.release_date}</p>
                </div>
              </div>
              <div className="p-4 rounded-md border border-white border-solid	">
                <p className="w-full">{movie?.overview}</p>
              </div>
              <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
                <div className="flex flex-col space-y-3 text-sm">
                  <div>
                    <span className="text-[gray]">ژانر:</span>{" "}
                    {genres.map((genre) => genre.name).join(", ")}
                  </div>

                  <div>
                    <span className="text-[gray]">زبان:</span>{" "}
                    {movie?.original_language}
                  </div>

                  <div>
                    <span className="text-[gray]">امتیاز:</span>{" "}
                    {ratings > 0 ? ratings : movie?.vote_count}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button onClick={() => setShowCament(!showCament)}>
                برای مشاهده نظرات کلیک کنید
              </button>

              {movie && user?.userInfo && showCament ? (
                <Comments
                  movie={movie}
                  ratings={movie?.vote_count}
                  newratings={ratings}
                />
              ) : null}
            </div>
          </div>
        </>
      </MuiModal>
    </>
  );
}

export default Modal;
