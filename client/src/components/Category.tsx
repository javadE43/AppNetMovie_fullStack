//module external
import { Outlet } from "react-router-dom";

//
import Card from "../subcomponents/Card";
import { useAppSelector } from "../app/hooks";

//type
import { Movies, StateTypeAuth } from "../typeing";

//interface
interface Props {
  movie: Movies[] | null;
  gener: number;
}

function Category({ movie, gener }: Props) {
  //accessToken
  const accesstoken = useAppSelector((state: StateTypeAuth) => state?.auth);
  
  return (
    <>
      <div className="flex flex-wrap justify-center	items-center">
        <>
          {movie ? (
            <>
              {movie?.map((item:any) => (
                <div className="flex flex-wrap">
                  {gener === 0 ? (
                    <>
                      <Card key={item.id} movie={item} />
                    </>
                  ) : (
                    <>
                      movie?.genre_ids.includes(gener) &&{" "}
                      <Card key={item.id} movie={item} />
                    </>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="w-[21rem] max-w-[100%] bg-black rounded-xl p-3 text-white m-5 flex flex-col  cursor-pointer text-xl hover:scale-110 h-36 justify-center item-center">
              <div className="h-[100%]">
                <h4>فیلم وجود ندارد</h4>
              </div>
            </div>
          )}
        </>
      </div>
      {accesstoken?.accessToken && <Outlet />}
    </>
  );
}

export default Category;
