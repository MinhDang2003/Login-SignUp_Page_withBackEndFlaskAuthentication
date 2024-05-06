import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import HCMUTlogo from "../assets/OIP.png";
import { render } from "react-dom";

function Sidebar() {
	const logout = useLogout();
	const navigate = useNavigate();
	const signOut = async () => {
		await logout();
		navigate("/login");
	};
	return (
		<div className="h-10">
			<nav className="bg-[#FEFAF6] h-10">
				<ul className=" flex items-center">
                    <li >
                        <img className="h-8 items-center" src={HCMUTlogo} alt="HCMUT logo" />
                    </li>
					<li  >
						<Link to="/Dashboard" className="block p-3  ">
							Dashboard
						</Link>
					</li>
					<li >
						<Link to="/" className="block p-3 ">
							Home
						</Link>
					</li>
					<div >
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
