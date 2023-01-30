import { useEffect, useState, useCallback } from "react";

//module external
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useRecoilState } from "recoil";

//
import { pageinationAtom } from "../atoms/modalAtom";

//interface
interface Props {
  page: number;
  separate: number;
  moving: number;
  title:string
}

//component
const Pageination = ({ page, moving, separate,title }: Props) => {
  const [pageinationatom, setPageinationAtom] = useRecoilState(pageinationAtom);

  const [prev, setPrev] = useState<number>(0);
  
  const [pageination, setPageination] = useState<number[]>([0, separate]);
  //Number of saved videos
  const [count, setCount] = useState<number[]>([]);

  //Controlling the next and previous buttons
  const handlePageination = (type: string) => {
    const pagein = [...pageination];
    if (type === "next") {
      if (pagein[1] <= count.length) {
        pagein[0] += moving;
        pagein[1] += moving;
        setPageination(pagein);
        setPrev(prev + moving);
      }
    }
    if (type === "prev") {
      if (pagein[0] > 0 && pagein[1] > separate) {
        pagein[0] -= moving;
        pagein[1] -= moving;
        setPageination(pagein);
        setPrev(prev - moving);
      }
    }
  };

//Back to the first page by clicking the button
  const handlepagePrev = (prev: number) => {
    setPageinationAtom(prev);
    setPageination([0, separate]);
    setPrev(prev - prev);
  };

  // Get the number of pages based on the number of videos
  //The number of videos by the number of lines
  const hanldePage = useCallback(() => {
    const count = Math.ceil(page / separate);
    const num = [];
    for (let i = 1; i <= count; i++) {
      num.push(i);
    }
    if (num.length > 0) {
      setCount(num);
    }
  }, [page,separate]);

//It is executed by changing the number of movies
  useEffect(() => {
    hanldePage();
  }, [page,separate]);
  return (
    <>
      <nav>
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center text-black">
            <span className="text-[7px]">تعداد صفحات</span>
            <span className="text-red-400">({page!=0?((count?.length -1) + 1):0})</span>
          </div>
          <div className="flex items-center text-black">
            <span className="text-[7px]">تعداد {title}</span>
            <span className="text-red-400">({page})</span>
          </div>
        </div>
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              onClick={() => handlePageination("next")}
              className={`block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                pageination[1] <= count.length ? "bg-blue-500" : null
              }`}
            >
              <span className="sr-only">بعد</span>
              <HiChevronRight size={20} />
            </button>
          </li>
           {
            page==0?
            <li>
            <button
             
              className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white 
              `}
            >
              0
            </button>
          </li>
            :
            <>
              {count?.slice(pageination[0], pageination[1]).map((p, i) => (
              <li key={i}>
                <button
                  onClick={() => setPageinationAtom(p)}
                  className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    p == pageinationatom ? "bg-blue-600" : null
                  }`}
                >
                  {p}
                </button>
              </li>
            ))}
            </>
           }
          <ul className={`text-blue-500 ${prev > 0 ? "flex" : "hidden"}`}>
            <li className="flex justfy-center items-center mr-[1px]]">
              <span className="bg-blue-500 w-2 h-2 inline-block rounded"></span>
            </li>
            <li className="flex justfy-center items-center mr-1px">
              <span className="bg-blue-500 w-2 h-2 inline-block rounded"></span>
            </li>
            <li className="flex justfy-center items-center mr-px">
              <span className="bg-blue-500 w-2 h-2 inline-block rounded"></span>
            </li>
          </ul>
          <li className={`${prev > 0 ? "block" : "hidden"}`}>
            <button
              onClick={() => handlepagePrev(prev)}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {prev}
            </button>
          </li>
          <li>
            <button
              onClick={() => handlePageination("prev")}
              className={`block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                prev > 0 ? "bg-red-500" : null
              }`}
            >
              <span className="sr-only">قبل</span>
              <HiChevronLeft size={20} />
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Pageination;
