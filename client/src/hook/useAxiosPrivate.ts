import { axiosPrivate } from "../axios/configApi";
import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import useRefreshToken from "./useRefreshToken";
import { StateTypeAuth } from "../typeing";



const useAxiosPrivate = () => {
  const user = useAppSelector((state: StateTypeAuth) => state.auth.accessToken);
  const refresh = useRefreshToken();
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: any) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403  && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          // prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          prevRequest.headers={
            ...prevRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          }
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [user, refresh]);
  return axiosPrivate;

};

export default useAxiosPrivate;
