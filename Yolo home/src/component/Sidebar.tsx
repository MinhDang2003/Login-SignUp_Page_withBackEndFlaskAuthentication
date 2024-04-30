import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import HCMUTlogo from "../assets/OIP.png";

function Sidebar() {
	const logout = useLogout();
	const navigate = useNavigate();
	const signOut = async () => {
		await logout();
		navigate("/login");
	};
	return (
		<div className="flex">
			<nav className="w-full h-screen bg-[#EBE4D1] ">
				<ul className="flex flex-col w-full">
                    <li className="w-auto">
                        <img src={HCMUTlogo} alt="HCMUT logo" className="w-1/6  mx-auto" />
                    </li>
					<li className="w-full">
						<Link to="/Dashboard" className="block p-3  ">
							Dashboard
						</Link>
					</li>
					<li className="w-full">
						<Link to="/" className="block p-3 ">
							Home
						</Link>
					</li>
					<div className="w-full">
						<Link to="#" className="block p-3 hover:bg-transparent hover:text-[#26577C]  navItem" onClick={signOut}>
							Log Out
						</Link>
					</div>
				</ul>
			</nav>
		</div>
	);
}

export default Sidebar;
