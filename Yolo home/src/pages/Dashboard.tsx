import { Link } from "react-router-dom"
import Users from "../component/Users";

function Dashboard() {
    return (
        <section>
            <h1>The Dashboard</h1>
            <br />
            <Users/>
            <br/>
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    )
}
export default Dashboard;