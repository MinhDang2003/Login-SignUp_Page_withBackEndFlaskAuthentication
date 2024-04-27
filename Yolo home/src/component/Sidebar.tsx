import { Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
function Sidebar() {
    const logout = useLogout();
    return (
        <div className="flex">
            <nav className="w-full h-screen bg-[#faf0dc] ">
                <ul className="flex flex-col w-full">
                    <li className="w-full">
                        <Link to="/Dashboard" className="block p-3 text-black hover:text-[#0047AB] ">
                            Dashboard
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link to="/" className="block p-3 text-black text hover:text-[#0047AB]">
                            Home
                        </Link>
                    </li>
                    <button  className="block p-3 text-black hover:text-[#0047AB] bg-transparent hover:border-transparent text-left  ">
                        Log Out
                    </button>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
