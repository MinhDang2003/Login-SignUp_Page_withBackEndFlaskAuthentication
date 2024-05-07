import {Link } from "react-router-dom";
import Users from "../component/Users";
import Sidebar from "../component/Sidebar";
function Dashboard() {
	return (
		<div className="w-screen h-screen  items-start">
			<aside className="w-screen">
				<Sidebar />
			</aside>
			<section className="flex-grow p-6">
				<h1>Dashboard</h1>
				<br />
				<Users />
				<br />
				<div className="flex">
					<Link to="/">Home</Link>
				</div>
			</section>
		</div>
	);
}
export default Dashboard;
