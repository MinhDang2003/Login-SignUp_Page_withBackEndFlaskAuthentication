import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="flex">
            <nav className="w-64 h-screen bg-[#faf0dc] ">
                <ul className="flex flex-col w-full">
                    <li className="w-full">
                        <Link to="/Dashboard" className="block p-4 text-black hover:bg-[#e8dcb5]">Dashboard</Link>
                    </li>
                    <li className="w-full">
                        <Link to="/" className="block p-4 text-black hover:bg-[#e8dcb5]">Home</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
export default Sidebar;
