
import { useState,useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate,useLocation } from "react-router-dom";
import axios,{AxiosError} from "axios";

function Users() {
    const [users,setUsers] = useState({name: "",about: ""});
    const axiosPrivate = useAxiosPrivate();const navigate = useNavigate();const location = useLocation();
    useEffect(() => {
        //let isMounted = true;
        //const controller = new AbortController();
        


        const getUsers = async() => {
            try {
                const response = await axiosPrivate.get("/users/profile", {
                    
                    
                })
                console.log(response?.data)
                setUsers({name: response?.data?.user?.name , about: response?.data?.user?.about})
                //isMounted && setUsers({name: response?.data?.user?.name , about: response?.data?.user?.about})
            } catch(error) {
                if (axios.isAxiosError(error)) {
                    
                    const axiosError = error as AxiosError;
                    console.error(axiosError)
                }
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();
        
        return () => {
            //isMounted = false;
            //controller.abort();
        }
    },[])

    return (
        <article>
            {
                users?.name ? (
                    <h2>Hello {users?.name} <br></br> {users?.about}</h2>
                ) : <p> Nothing to display</p>
            }
            
        </article>
    )
}
export default Users;