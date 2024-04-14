import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvide";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios,{AxiosError} from "axios";
function Home() {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint
        try {
            const response = await axiosPrivate.post("/users/logout")
            console.log(response?.data)
            setAuth({token: "",refresh:""});
            navigate('/login');
        } catch(error) {
            if (axios.isAxiosError(error)) {
                    
                const axiosError = error as AxiosError;
                console.error(axiosError)
            }
            setAuth({token: "",refresh:""});
            navigate('/login');
        }
        
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>You are logged in!</p>
            <br />
            <Link to="/Dashboard">Go to the Dashboard</Link>
            <br />
            <div className="flexGrow">
                <button onClick={logout}>Sign Out</button>
            </div>
        </section>
    )
}
export default Home