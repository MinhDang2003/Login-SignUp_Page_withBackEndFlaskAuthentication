import { Link } from "react-router-dom";
const Sidebar = () => {
    return (
        <div className="flex font-poppins">
            <nav className="w-full h-screen bg-[#faf0dc] ">
                <ul className="flex flex-col w-full">

                    <li className="w-full">
                        <Link to="/Dashboard" className="block p-3 text-black  hover:text-[#0047AB]  ">Dashboard</Link>
                    </li>
                    <li className="w-full">
                        <Link to="/" className="block p-3 text-black text hover:text-[#0047AB]">Home</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
export default Sidebar;
