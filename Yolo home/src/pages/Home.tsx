import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";

function Home() {
    
    const navigate = useNavigate();
    
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p >You are logged in!</p>
            <br />
            <Link to="/Dashboard">Go to the Dashboard</Link>
            <br />
            <div className="flexGrow">
                <button onClick={signOut}>Log Out</button>
            </div>
        </section>
    )
}
export default Home