import * as React from "react";

//module external
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { HiOutlineHome } from "react-icons/hi";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineLogin } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

//
import { axiospublic } from "../axios/configApi";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/auth";

//component
export default function NavigationBottom() {
  const dispatch= useAppDispatch();
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const hanlerLogout = async () => {
    try {
      await axiospublic.get("/auth/logout");
      navigate("/");
      dispatch(logout())
    } catch (error) {}
  };

  return (
    <Box className="w-full bg-[rgba(18,18,18,0)] sticky bottom-0 z-50 md:static">
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          width: "100%",
          backgroundColor: "rgba(18,18,18,0)",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <BottomNavigationAction
          icon={<HiOutlineLogin size={30} />}
          onClick={() => hanlerLogout()}
        />
        <Link to="/">
          <BottomNavigationAction
            sx={{ color: "#1976d2" }}
            icon={<HiOutlineHome size={30} />}
          />
        </Link>
        <Link to="/dashboard">
          <BottomNavigationAction
            icon={<HiOutlineUser size={30} />}
            sx={{ color: "#1976d2" }}
          />
        </Link>
      </BottomNavigation>
    </Box>
  );
}
