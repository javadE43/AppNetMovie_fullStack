import React,{ useEffect, useState, CSSProperties } from "react";

//module external
import { useAppSelector, useAppDispatch } from "../app/hooks";
import MuiModal from "@mui/material/Modal";
import { motion } from "framer-motion";
import { BsX } from "react-icons/bs";
import { Categories, Movies, StateTypeAuth } from "../typeing";
import { Outlet, useLocation } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

//
import Header from "../components/Header";
import Row from "../components/Row";
import Sidebar from "../components/Saidebar";
import SliderHome from "../components/slider";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import NavigationBottom from "../subcomponents/NavigationBottom";
import { fatchmylist } from "../features/mylist/mylist";

// interface
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -50%)",
  right: "44%",
};

interface togglesidebar {
  sidebar: { toggle: boolean };
}

interface MoviesType {
  movies: {
    movies: Movies[];
    Allmovie: Movies[];
    isLoading: boolean;
    ErrorMessage: string;
  };
}
interface Mylist {
  mylist: {
    mylist: Movies[];
    isLoading: boolean;
    ErrorMessage: string;
  };
}

interface Cat {
  title: string;
  bits: number;
  image: string;
  content: string;
}

interface Categorys {
  categorys: {
    categorys: Categories[];
    categoryPublic: Categories[];
    isLoading: boolean;
    ErrorMassege: string;
  };
}

const Home: React.FC = () => {
  let [color, setColor] = useState("#ffffff");
  const [showalret, setShowAlert] = useState(true);
 
  //
  const mylist = useAppSelector((state: Mylist) => state?.mylist);
  const user = useAppSelector((state: StateTypeAuth) => state.auth);
  const toggle = useAppSelector(
    (state: togglesidebar) => state?.sidebar?.toggle
  );
  const categorys = useAppSelector(
    (state: Categorys) => state.categorys.categoryPublic
  );
  const movies = useAppSelector((state: MoviesType) => state.movies.Allmovie);
  //
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();

  //useEffect
  useEffect(() => {
    if (user?.accessToken && user?.userInfo?.id) {
      dispatch(fatchmylist({ axiosPrivate, userid: user.userInfo.id }));
    }
  }, [user?.accessToken]);

  //return
  return (
    <div className="relative">
      <Header />
      {categorys?.length > 0 && movies ? (
        <div className="relative h-auto bg-gradient-to-b from-[#141414] to-[#141414] lg:h-auto overflow-hidden">
          <div
            className={`fixed top-0 z-[999] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${
              showalret ? "block" : "hidden"
            }`}
          >
            <strong className="font-bold">رمز ورود و نام کاربری:ادمین</strong>
            <span className="block sm:inline">
              <span className="mx-2">نام کاربری:جواد</span>
              <span>رمز ورود:%$@G1234</span>
            </span>
            <span
              className="absolute top-0 bottom-0 left-0 px-4 py-3"
              onClick={() => setShowAlert(false)}
            >
              <BsX className="text-red-400" />
            </span>
          </div>
          <main className="relative">
            <>
              {movies && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SliderHome banner={movies} />
                </motion.div>
              )}
              <div className={`${toggle ? "block" : "hidden"}`}>
                {user?.userInfo ? (
                  <Sidebar role={user?.userInfo?.role} />
                ) : (
                  <Sidebar role={"user"} />
                )}
              </div>
              <section className="md:space-y-24 mt-[20%] sm:mt-[25%] md:mt-[25%] lg:mt-[25%] xl:mt-[30%]">
                {categorys?.length > 0
                  ? categorys?.map((item, i) => (
                      <React.Fragment key={i}>
                        {item.bits !== 1 && (
                          <>
                            {item.bits !== 100 ? (
                              <Row
                                key={i}
                                title={item?.title}
                                movies={movies}
                                category={item?.bits}
                              />
                            ) : null}
                          </>
                        )}
                      </React.Fragment>
                    ))
                  : null}
                {user?.accessToken ? (
                  <>
                    {mylist?.mylist?.length > 0
                      ? categorys?.map((item, i) => (
                          <React.Fragment key={i}>
                            {item?.bits === 1 && (
                              <Row
                               key={i}
                                title={item?.title}
                                movies={mylist?.mylist}
                                category={item?.bits}
                              />
                            )}
                         </React.Fragment>
                        ))
                      : null}
                  </>
                ) : null}
              </section>
            </>
          </main>
          {user?.accessToken && <Outlet />}
        </div>
      ) : (
        <>
          <MuiModal
            open={true}
            className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
          >
            <ClipLoader
              color={color}
              loading={true}
              cssOverride={override}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </MuiModal>
        </>
      )}
      <NavigationBottom />
    </div>
  );
};

export default Home;
