import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    
    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            
            config => {
                 
                if (!config.headers['Authorization']) {
                    if (auth?.token !== "") {
                        
                        config.headers['Authorization'] = `Bearer ${auth?.token}`;
                    }

                }
                return config;
            }, (error) => {Promise.reject(error)}
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => { 
                const prevRequest = error?.config;
                
                if (error?.response?.status === 401 && !prevRequest?._sent) {
                    
                    prevRequest._sent = true
                    
                    const newAccessToken = await refresh();
                    
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                // if (error?.response?.status === 402 && prevRequest?.sent) {
                //     console.log(error)
                // }
                
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept)
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;