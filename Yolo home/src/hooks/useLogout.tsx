//import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";
import { axiosPrivate } from "../api/axios";
const useLogout = () => {
    const { setAuth } = useAuth();
    //const axiosPrivate = useAxiosPrivate()
    const logout = async () => {
        
        try {
            const response = await axiosPrivate.post('/users/logout');
            setAuth({token: ""});
            console.log(response?.data?.msg)
        } catch (err) {
            setAuth({token: ""});
            console.error(err);
        }
    }

    return logout;
}

export default useLogout