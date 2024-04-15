
import { useState,useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate,useLocation } from "react-router-dom";
import axios,{CancelTokenSource} from "axios";
import useAuth from "../hooks/useAuth";

interface UserInfo {
    name: string;
    about: string;
  }
  

function Users() : JSX.Element  {
    const {auth} = useAuth();
    const [users,setUsers] = useState<UserInfo |null>(null);
    const axiosPrivate = useAxiosPrivate();const navigate = useNavigate();const location = useLocation();
    useEffect(() => {
        const source: CancelTokenSource = axios.CancelToken.source();
        axiosPrivate.get("/users/profile", {
            cancelToken: source.token,
        })
        .then((res) => {setUsers(res?.data?.user)})
        .catch((thrown) => {
            if (axios.isCancel(thrown)) {
                console.log('Request canceled');
            } else {                    
                navigate('/login', { state: { from: location }, replace: true });

            }

            
        })
        
        return () => {
            source.cancel();
        }
    },[axiosPrivate,navigate,location,auth.token])

    return (
        <article>
            {
                users ? (
                    <h2>Hello {users?.name} <br></br> {users?.about}</h2>
                ) : <p> Nothing to display</p>
            }
            
        </article>
    )
}
export default Users;