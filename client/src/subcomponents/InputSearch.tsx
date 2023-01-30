import { useState, CSSProperties } from "react";

//
//module external
import axios from "axios";
import MuiModal from "@mui/material/Modal";
import { AnimatePresence, motion } from "framer-motion";
import { BsSearch } from "react-icons/bs";
import { BASE_URL } from "../axios/configApi";
import { Movies } from "../typeing";
import { Link } from "react-router-dom";
import MoonLoader from "react-spinners/MoonLoader";
import { useRecoilState } from "recoil";
import { movieState } from "../atoms/modalAtom";
const overrideupdate: CSSProperties = {
  borderColor: "#36d7b7",
  position: "absolute",
  top: "50%",
  right: "44%",
};
//component
const InputSearch = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [movie, setMovie] = useRecoilState(movieState);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<Movies[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const handleClose = () => {
    setShowFilter(false);
  };
  const handleSearch = async (value: string) => {
    if (value) {
      setLoading(true);
      try {
        const data = await axios.get(
          `${BASE_URL}/movies/search?search=${value}`
        );
        if (data?.data) {
          setSearch(data?.data.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    }
  };
  const handleShowMovie = (id: number) => {
    if (search) {
      const m = search.filter((item) => item.id === id);
      if (m) setMovie(m[0]);
    }
  };
  return (
    <AnimatePresence>
      <div className="ml-2 ">
        <form className="flex items-center">
          <button
            type="button"
            className="p-2.5 ml-2  text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setShowFilter(true)}
          >
            <BsSearch size={20} className="text-white" />
          </button>
          <div className={`relative w-full transition-all`}>
            <MuiModal
              open={showFilter}
              onClose={handleClose}
              className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
            >
              <motion.div
                className="bg-transparent"
                initial={{ y: -500 }}
                animate={{ y: 0, transition: { duration: 0.7 } }}
                exit={{ y: -500, transition: { duration: 0.7 } }}
              >
                <div>
                  <div className="bg-white mb-4 rounded px-2">
                    <input
                      type="text"
                      className={`bg-gray-50 text-gray-900 text-sm focus:outline-none block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition ease-in-out 
                    duration-700`}
                      placeholder="جستجو"
                      required
                      onChange={(
                        event: React.ChangeEvent<
                          | HTMLInputElement
                          | HTMLTextAreaElement
                          | HTMLSelectElement
                        >
                      ) => handleSearch(event.target.value)}
                    />
                  </div>
                  <ul className="relative h-40 bg-white rounded-lg p-2 rounded-md overflow-hidden overflow-y-scroll scrollbar-hide">
                    {loading ? (
                      <MoonLoader
                        color={"#36d7b7"}
                        loading={loading}
                        cssOverride={overrideupdate}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    ) : (
                      <>
                        {search?.map((item, i) => (
                          <li key={i} className="border-b border-black pb-2">
                            <Link
                              to={`/movie/${item.id}`}
                              className="text-black"
                              onClick={() => handleShowMovie(item.id)}
                            >
                              <div className="flex gap-2 items-center ">
                                <img
                                  className="w-4 h-4 rounded-sm sm:w-4 h-4 rounded-sm "
                                  src={`${item?.poster_path}`}
                                />
                                <span>{item.title}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>
              </motion.div>
            </MuiModal>
          </div>
        </form>
      </div>
    </AnimatePresence>
  );
};

export default InputSearch;
