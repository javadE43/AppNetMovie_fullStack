import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import {useLocation} from "react-router-dom"
//
import { useAppDispatch } from "./app/hooks";
import ConfigPages from "./configPages/ConfigPages";
import { fatchCategorysPublic } from "./features/categorys/category";
import { fatchRefreshToken } from "./features/auth/auth";
import { fatchmoviesPublic } from "./features/movies/movies";

//APP
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fatchmoviesPublic());
    dispatch(fatchCategorysPublic());
    dispatch(fatchRefreshToken());
  }, []);
  return (
    <div className="relative container mx-auto">
      <ConfigPages />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
