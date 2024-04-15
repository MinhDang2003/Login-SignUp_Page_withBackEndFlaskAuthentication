
import axios, {AxiosError} from "axios";
import useAuth from "./useAuth";
import { axiosPublic } from "../api/axios";
const useRefreshToken = () => {
    const {setAuth} = useAuth();
    const refresh = async () => {
        try {
            const response = await axiosPublic.get('/users/refresh', {withCredentials: true, headers: {'Content-Type': 'application/json'}}) ;
            setAuth((prev) => {
                return {...prev, token: response?.data?.token}
            })
            return response?.data?.token
        } catch(error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 402) {console.log(axiosError.response?.data?.msg);console.error(axiosError)}
                else {console.error(axiosError);}
            }
            else {
                console.log("ANOTHER")
                console.error(error)
            }
        }
    }
    return refresh;
}
export default useRefreshToken