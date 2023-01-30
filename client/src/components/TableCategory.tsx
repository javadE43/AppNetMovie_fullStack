import { useState, useEffect, useCallback, CSSProperties } from "react";

//module external
import { AnimatePresence, motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import MoonLoader from "react-spinners/MoonLoader";
import { useRecoilState } from "recoil";
import * as timeago from "timeago.js/lib/index";
import { HiPencil, HiMinus, HiPlus } from "react-icons/hi2";
import { BsX } from "react-icons/bs";
import MuiModal from "@mui/material/Modal";

import {
  HiTrash,
  HiMagnifyingGlass,
  HiOutlineUserPlus,
  HiDocumentDuplicate,
} from "react-icons/hi2";
import { Outlet } from "react-router-dom";
//
import { pageinationAtom } from "../atoms/modalAtom";

import useAxiosPrivate from "../hook/useAxiosPrivate";

import { Users, StateTypeAuth, Movies, Categories } from "../typeing";
import Pageination from "../subcomponents/Pagination";
import { Link } from "react-router-dom";
import { axiospublic, BASE_URL } from "../axios/configApi";
import { tableCategory } from "../data/dataTableCategory";
import { filterRow } from "../data/filter";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  fatchCategorys,
  fatchDeleteCategory,
  restartDefaultCategorys,
} from "../features/categorys/category";

//interface
interface State {
  users: {
    users: Users[] | null;
    count: number;
    isloading: boolean;
    ErrorMessage: string | null;
  };
}
interface MoviesType {
  movies: {
    movies: Movies[] | null;
    movie: Movies | null;
    insert: number;
    update: number;
    delete: number;
    isloading: boolean;
    ErrorMessage: string | null;
  };
}

interface FilterUsername {
  username: string;
  id: number;
}
const overrideupdate: CSSProperties = {
  borderColor: "#36d7b7",
  position: "absolute",
  top: "50%",
  right: "44%",
};
interface Cat {
  title: string;
  image: string;
  content: string;
  bits: number;
  username: string;
  createdAt: string;
  updatedAt: string;
}
interface Input {
  title: string;
  image: string;
  content: string;
}
interface Categorys {
  categorys: {
    categorys: Categories[];
    categoryPublic: Categories[];
    update: number;
    delete: number;
    insert: number;
    count: number;
    isLoading: boolean;
    ErrorMassege: string;
  };
}
const menuVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
  closed: {
    opacity: 1,
    x: -window.innerWidth,
    transition: { duration: 0.5 },
  },
};
const menuVariantsSectionFillter = {
  open: {
    height: 400,
    transition: { duration: 0.3 },
  },
  closed: {
    height: 0,
    transition: { duration: 0.3 },
  },
};
const TableCategory = () => {
  const [pageinationatom, setPageinationAtom] = useRecoilState(pageinationAtom);
  // state movies
  const [category, setCategory] = useState<Categories[]>([]);
  const [categoryArray, setCategoryArray] = useState<Categories[]>([]);
  const [count, setCount] = useState<number>(0);
  //   Saved number of videos and creators of videos
  const [filterusername, setfilterusrname] = useState<FilterUsername[]>([]);
  // state fillter
  const [filterow, setfilterRow] = useState<any>(3);
  const [filterCategory, setfilterCategory] = useState<any>();
  const [filterfilterUser, setfilterUser] = useState<any>("");
  // toggle filter items
  const [showFilterCategory, setShowFilterCategory] = useState<boolean>(false);
  const [showFilterRow, setShowFilterRow] = useState<boolean>(false);
  const [showFilterUser, setShowFilterUser] = useState<boolean>(false);
  // show sidebar filter ___ mobile
  const [toggleSidebarFilterM, setToggleSidebarFilterM] =
    useState<boolean>(false);
  // react form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Input>();
  //
  const categorys = useAppSelector((state: Categorys) => state?.categorys);
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);
  //
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxiosPrivate();
  // search category
  const searchCategory = (search: string) => {
    if (search) {
      dispatch(fatchCategorys({ axiosPrivate, search }));
    } else {
    }
  };

  //Filter control based on video creator
  const handleUsernameAndCategory = useCallback(() => {
    if (filterfilterUser && filterCategory) {
      dispatch(
        fatchCategorys({
          axiosPrivate,
          page: pageinationatom,
          pageSize: filterow,
          userid: filterfilterUser,
          bits: filterCategory,
        })
      );
    }
  }, [filterfilterUser, filterow, pageinationatom, filterCategory]);
  //Filter control based on video creator
  const handleUsernameFilter = useCallback(() => {
    if (filterfilterUser && !filterCategory) {
      dispatch(
        fatchCategorys({
          axiosPrivate,
          page: pageinationatom,
          pageSize: filterow,
          userid: filterfilterUser,
        })
      );
    }
  }, [filterfilterUser, filterow, pageinationatom]);

  //Filter control based on categories
  const handleCategorysFilter = useCallback(() => {
    if (filterCategory && !filterfilterUser) {
      dispatch(
        fatchCategorys({
          axiosPrivate,
          bits: filterCategory,
          page: pageinationatom,
          pageSize: filterow,
        })
      );
    }
  }, [filterCategory, pageinationatom, filterow]);
  //It is executed by changing the pagination buttons
  const handlePageintaion = useCallback(() => {
    if (!filterCategory && !filterfilterUser) {
      dispatch(
        fatchCategorys({
          axiosPrivate,
          page: pageinationatom,
          pageSize: filterow,
        })
      );
    }
  }, [pageinationatom, filterow]);

  useEffect(() => {
    if (!filterCategory && !filterfilterUser) handlePageintaion();
    if (filterCategory && !filterfilterUser) handleCategorysFilter();
    if (filterfilterUser && !filterCategory) handleUsernameFilter();
    handleUsernameAndCategory();
  }, [pageinationatom, filterCategory, filterfilterUser, filterow]);

  //delete category
  const deleteCategory = (bits: number) => {
    if (bits && user?.userInfo?.id)
      dispatch(
        fatchDeleteCategory({ axiosPrivate, bits, userid: user?.userInfo?.id })
      );
  };
  // Get the collection of movies as numbers
  const countCategory = async () => {
    try {
      const res = await axiosPrivate.get(`${BASE_URL}/category/count`);
      if (res && res.status == 200) {
        setfilterusrname(res.data?.data.userCat);
        setCategoryArray(res.data?.data.category);
      }
    } catch (error) {}
  };
  //  Back to default when entering the page
  useEffect(() => {
    countCategory();
    dispatch(fatchCategorys({ axiosPrivate, page: 1, pageSize: filterow }));
  }, [categorys?.delete]);
  useEffect(() => {
    dispatch(restartDefaultCategorys())
  }, []);
  // update state movies and countMovies
  useEffect(() => {
    categorys?.categorys && setCategory(categorys?.categorys);
    if (categorys?.count >= 0) setCount(categorys?.count);
  }, [categorys?.categorys, categorys?.count]);
  useEffect(() => {
    setPageinationAtom(1);
  }, [toggleSidebarFilterM]);
  //return
  return (
    <motion.div
    //    initial={{x: -window.innerWidth }}
    //   animate={{x:0,transition: { duration: 0.755 } }}
    //  exit={{x: -window.innerWidth, transition: { duration: 0.755 } }}
    >
      <MuiModal
        open={categorys?.isLoading ? true : false}
        className="fixed top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <MoonLoader
          color={"#36d7b7"}
          loading={categorys?.isLoading ? true : false}
          cssOverride={overrideupdate}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </MuiModal>
      {/* <!-- Mobile  and desktop filter dialog --> */}
      <AnimatePresence>
        {/* {toggleSidebarFilterM && */}
        <div className={`relative z-40 bg-header `}>
          <motion.div
            className="fixed top-0 bottom-0 left-0 z-40 flex w-[35%] opacity-0"
            initial={{ opacity: 1, x: -window.innerWidth }}
            animate={toggleSidebarFilterM ? "open" : "closed"}
            variants={menuVariants}
          >
            <div className="relative mr-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white  pb-12 shadow-xl  !scrollbar-thin !scrollbar-track-transparent !scrollbar-thumb-red-500">
              <div className="flex items-center justify-between p-4 bg-header">
                <h2 className="flex-1 text-lg font-lg text-white text-center">
                  فیلتر
                </h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setToggleSidebarFilterM(!toggleSidebarFilterM)}
                >
                  <span className="sr-only">Close menu</span>
                  {/* <!-- Heroicon name: outline/x-mark --> */}
                  <BsX />
                </button>
              </div>

              {/* <!-- Filters --> */}
              <form className="flex flex-col justify-center items-center border-t border-gray-200">
                <h3 className="sr-only">فیلتر</h3>

                <div className="border-t border-gray-200 px-4 py-6 w-[90%]">
                  <div
                    className={`-mx-2 -my-3 flow-root rounded ${
                      showFilterCategory
                        ? "border border-red-500"
                        : "border border-[#1b2a4e]"
                    }`}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-transparent px-2 py-3 text-gray-400 hover:text-gray-500"
                      onClick={() => setShowFilterCategory(!showFilterCategory)}
                    >
                      <span className="font-medium text-gray-900">
                        دسته بندی
                      </span>
                      <span className="ml-6 flex items-center">
                        {showFilterCategory ? <HiMinus /> : <HiPlus />}
                      </span>
                    </button>
                  </div>

                  <motion.div
                    className={`pt-6" id="filter-section-mobile-0 mt-4 overflow-hidden overflow-y-scroll scrollbar-hide `}
                    initial={{ height: 0 }}
                    animate={showFilterCategory ? "open" : "closed"}
                    variants={menuVariantsSectionFillter}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center hover:bg-blue-100 p-2 rounded-md p-0">
                        <label
                          form="filter-color-0"
                          className="ml-3 min-w-0 flex-1 text-gray-500"
                        >
                          <input
                            name="category"
                            type="radio"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={() => setfilterCategory(null)}
                          />
                          همه
                        </label>
                      </div>
                      {categoryArray?.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center hover:bg-blue-100 p-2 rounded-md"
                        >
                          <label
                            form="filter-color-0"
                            className="ml-3 min-w-0 flex-1 text-gray-500"
                          >
                            <input
                              name="category"
                              value={item.bits}
                              type="radio"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              onChange={(
                                event: React.ChangeEvent<
                                  | HTMLInputElement
                                  | HTMLTextAreaElement
                                  | HTMLSelectElement
                                >
                              ) => setfilterCategory(event.target.value)}
                            />
                            {item.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 w-[90%]">
                  <div
                    className={`-mx-2 -my-3 flow-root rounded ${
                      showFilterRow
                        ? "border border-red-500"
                        : "border border-[#1b2a4e]"
                    }`}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-transparent px-2 py-3 text-gray-400 hover:text-gray-500"
                      onClick={() => setShowFilterRow(!showFilterRow)}
                    >
                      <span className="font-medium text-gray-900">
                        فیلتر سطر
                      </span>
                      <span className="ml-6 flex items-center">
                        {showFilterRow ? <HiMinus /> : <HiPlus />}
                      </span>
                    </button>
                  </div>
                  <motion.div
                    className={`pt-6" id="filter-section-mobile-0 mt-4 overflow-hidden overflow-y-scroll scrollbar-hide `}
                    initial={{ height: 0 }}
                    animate={showFilterRow ? "open" : "closed"}
                    variants={menuVariantsSectionFillter}
                  >
                    <div className="space-y-6">
                      {filterRow?.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center hover:bg-blue-100 p-2 rounded-md p-0"
                        >
                          <label
                            form="filter-category-0"
                            className="ml-3 min-w-0 flex-1 text-gray-500"
                          >
                            <input
                              name="filter"
                              value={item.title}
                              type="radio"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              onChange={(
                                event: React.ChangeEvent<
                                  | HTMLInputElement
                                  | HTMLTextAreaElement
                                  | HTMLSelectElement
                                >
                              ) => setfilterRow(event.target.value)}
                            />
                            {item.value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 w-[90%]">
                  <div
                    className={`-mx-2 -my-3 flow-root rounded ${
                      showFilterUser
                        ? "border border-red-500"
                        : "border border-[#1b2a4e]"
                    }`}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                      onClick={() => setShowFilterUser(!showFilterUser)}
                    >
                      <span className="font-medium text-gray-900">
                        ایجادکننده
                      </span>
                      <span className="ml-6 flex items-center">
                        {showFilterUser ? <HiMinus /> : <HiPlus />}
                      </span>
                    </button>
                  </div>

                  <motion.div
                    className={`pt-6" id="filter-section-mobile-0 mt-4 overflow-hidden overflow-y-scroll scrollbar-hide `}
                    initial={{ height: 0 }}
                    animate={showFilterUser ? "open" : "closed"}
                    variants={menuVariantsSectionFillter}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center hover:bg-blue-100 p-2 rounded-md p-0">
                        <label
                          form="filter-size-0"
                          className="ml-3 min-w-0 flex-1 text-gray-500"
                        >
                          <input
                            id="filter-size-0"
                            name="row"
                            type="radio"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={() => setfilterUser(null)}
                          />
                          همه
                        </label>
                      </div>
                      {filterusername?.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center hover:bg-blue-100 p-2 rounded-md p-0"
                        >
                          <label
                            form="filter-size-0"
                            className="ml-3 min-w-0 flex-1 text-gray-500"
                          >
                            <input
                              name="row"
                              value={item.id}
                              type="radio"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              onChange={(
                                event: React.ChangeEvent<
                                  | HTMLInputElement
                                  | HTMLTextAreaElement
                                  | HTMLSelectElement
                                >
                              ) => setfilterUser(event.target.value)}
                            />
                            {item.username}
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
        {/* }  */}
      </AnimatePresence>

      {/* content table */}

      <div className="p-4 overflow-x-auto relative shadow-md bg-[#f7f7f7] h-screen">
        <div className="flex justify-between items-center mb-4 rounded-sm p-4 bg-white dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <div>
              <Link
                to="insert"
                className="inline-flex items-center text-white bg-white border border-gray-300 bg-red-600 focus:outline-none hover:bg-red-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                جدید
                <HiOutlineUserPlus size={20} />
              </Link>
            </div>
            <div>
              <button
                onClick={() => setToggleSidebarFilterM(!toggleSidebarFilterM)}
                className="mr-4 inline-flex items-center text-white bg-white border border-gray-300 bg-red-600 focus:outline-none hover:bg-red-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 "
              >
                فیلتر
                <HiOutlineUserPlus size={20} />
              </button>
            </div>
          </div>
          <label form="table-search" className="sr-only">
            جستجو
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <HiMagnifyingGlass size={25} className="text-blue-500" />
            </div>
            <input
              type="text"
              className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="جستجو"
              onChange={(
                event: React.ChangeEvent<
                  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >
              ) => searchCategory(event.target.value)}
            />
          </div>
        </div>
        <div className="p-8 h-[100%] bg-white rounded-md">
          <table className="rounded-sm border-collapse border border-slate-400 table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs bg-header text-white uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="border border-slate-300 p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label form="checkbox-all-search" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
                {tableCategory?.map((item, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="border border-slate-300 py-3 px-6 text-start"
                  >
                    {item?.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {category?.map((item, i) => (
                <tr
                  key={i}
                  className={`dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                    timeago.format(item?.createdAt).includes("just") ||
                    timeago.format(item?.createdAt).includes("just")
                      ? "bg-green-400"
                      : "bg-white"
                  }`}
                >
                  <td className="border border-slate-300 p-4 w-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-3"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label form="checkbox-table-search-3" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="border border-slate-300 py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className=" flex items-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={
                          item?.image
                            ? `${item?.image}`
                            : "/docs/images/people/profile-picture-4.jpg"
                        }
                        alt=""
                      />
                      <div className="pl-3 overflow-hidden">
                        <div className="text-base font-semibold">
                          {item?.title}
                        </div>
                        {/* <div className="font-normal text-gray-500">{item?.email}</div> */}
                      </div>
                    </div>
                  </th>
                  <td className="border border-slate-300 py-4 px-6">
                    <div className="flex items-center">
                      {timeago.format(item?.createdAt)}
                    </div>
                  </td>
                  <td className="border border-slate-300 py-4 px-6 overflow-hidden">
                    <div className="flex items-center">{item?.content}</div>
                  </td>
                  <td className="border border-slate-300 py-4 px-6">
                    <div className="flex items-center">{item?.bits}</div>
                  </td>
                  <td className="border border-slate-300 py-4 px-6 overflow-hidden">
                    <div className="flex items-center">{item?.username}</div>
                  </td>
                  <td className="border border-slate-300 py-4 px-6">
                    <div className="flex justfy-center items-center  rounded-sm">
                      <Link
                        to={`update/${item?.bits}`}
                        className="text-black border border-red-100 hover:bg-white/[0.15] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-r-sm text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        // onClick={() => showModalEdit(item?.id)}
                      >
                        <HiPencil size={20} />
                      </Link>
                      <Link
                        to={`update/${item?.bits}`}
                        className="text-black border border-red-100 hover:bg-white/[0.15] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        // onClick={() => showModalEdit(item?.id)}
                      >
                        <HiDocumentDuplicate size={20} />
                      </Link>
                      <button
                        className="text-white border border-red-100 bg-red-600 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-l-sm  text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => deleteCategory(item?.bits)}
                      >
                        <HiTrash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-full flex justify-center items-center">
            <div className="w-[20%] flex justify-around items-center mt-4">
              <Pageination
                page={count}
                moving={1}
                separate={filterow}
                title={"دسته بندی"}
              />
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </motion.div>
  );
};

export default TableCategory;
