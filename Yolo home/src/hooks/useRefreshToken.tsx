
import axios, {AxiosError} from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const {auth,setAuth} = useAuth();
    const refresh = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8090/users/refresh', {withCredentials: true, headers: {'Authorization': `Bearer ${auth?.refresh}`,'Content-Type': 'application/json'}}) ;
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