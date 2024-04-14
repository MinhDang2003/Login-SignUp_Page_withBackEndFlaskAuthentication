import { Outlet } from "react-router-dom";

function Layout() {
    
    return(
        <main className="App">
            <Outlet></Outlet>
        </main>
    )
}
export default Layout