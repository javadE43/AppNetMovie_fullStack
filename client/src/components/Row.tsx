import React,{ useEffect, useRef, useState } from "react";

//module external
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Movies } from "../typeing";
import Thumbnail from "./thumbnail";
import { Link } from "react-router-dom";
import { moviefake } from "../data/data";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
//interface
interface Props {
  title: string;
  category: number;
  movies: Movies[] | null;
}

//component
function Row({ title, movies, category }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);
  //title
  const [Title, setTitle] = useState<string | number>("");
  const [movie, setMovie] = useState<Movies[]>([]);

  const handleClick = (direction: string) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };
  useEffect(() => {
    if (movies) {
      setMovie(movies)
      const title = movies.filter((item) => item.genre_ids.includes(category));

      if (title) setTitle(title[0]?.genre_ids[0]);
      else {
        setTitle("");
      }
    }
  }, [category, movies]);
  return (
    <div className="space-y-0.5 md:space-y-2">
      {Title == category ? (
        <Link
          to="/"
          className="relative cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl pr-3 p-2 text-center border border-white rounded-md inline-block w-[30%] sm:w-[15%]"
        >
          {title}
        </Link>
      ) : category === 1 ? (
        <Link
          to="/"
          className="relative cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl pr-3 p-2 text-center border border-white rounded-md inline-block w-[30%] sm:w-[15%]"
        >
          {title}
        </Link>
      ) : null}
      <div className="relative md:-ml-2">
        <Swiper
          spaceBetween={20}
          slidesPerView={2}
          navigation
          loop={false}
          modules={[Navigation, Pagination]}
          //  onSlideChange={() => console.log('slide change')}
          //  onSwiper={(swiper) => console.log(swiper)}
          breakpoints={{
            380: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            412: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            480: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            992: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
            1300: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
          }}
        >
          {category === 1 ? (
            <>
              {movie?.map((movie, i) => (
                <React.Fragment key={i}>
                  <SwiperSlide>
                    <Thumbnail
                      key={movie.id}
                      movie={movie}
                      category={category}
                    />
                  </SwiperSlide>
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {movie?.map((movie, i) => (
                <React.Fragment key={i}>
                  {movie?.genre_ids?.includes(category) && (
                    <SwiperSlide key={i}>
                      <Thumbnail
                        key={movie.id}
                        movie={movie}
                        category={category}
                      />
                    </SwiperSlide>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </Swiper>
      </div>
    </div>
  );
}

export default Row;
