import { useEffect } from "react";

//module external
import { modalSidebarAdmin } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import {
  Outlet,
  useNavigate,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";

//
import SidebarDashboard from "../subcomponents/Sidebardashboard";
import { StateTypeAuth, Userinfo } from "../typeing";
import { useAppSelector } from "../app/hooks";

//interface

//component
const Dashboard = () => {
  const user = useAppSelector((state: StateTypeAuth) => state?.auth);
  const [Sidebar, setSidebar] = useRecoilState(modalSidebarAdmin);
  const location = useLocation();
  return (
    <>
{ sessionStorage.getItem("accesstoken")?(<section>
        <div className="flex overflow-hidden overflow-x-auto">
          <div
            className={`transition-all ${
              Sidebar ? "grow-0 shrink" : "grow-0 shrink	"
            }`}
          >
            <SidebarDashboard />
          </div>
          <div className={`${Sidebar ? "grow" : "grow"}`}>
            <Outlet />
          </div>
        </div>
      </section>)
      :(<Navigate to="/login" state={{ from: location }} replace />)}
    </>
  );
};

export default Dashboard;
