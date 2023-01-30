import { axiospublic } from "../axios/configApi";
import {useAppDispatch } from "../app/hooks";
import { newAccessToken } from "../features/auth/auth";

const useRefreshToken = () => {
  const dispatch = useAppDispatch();

  const refresh = async () => {
    try {
      const { data } = await axiospublic.get("/auth/refreshtoken", {
        withCredentials: true,
      });
      dispatch(newAccessToken(data.data));
      return data?.data.accessToken;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  return refresh;
};

export default useRefreshToken;
