import Login from './pages/LoginPage.tsx';
import SignUp from './pages/SignUpPage.tsx';
import Home from './pages/Home.tsx';
import {Route,  Routes} from "react-router-dom";
import Layout from './component/Layout.tsx';
import Missing from './pages/Missing.tsx';
import RequireAuth from './component/RequireAuth.tsx';
import Dashboard from './pages/Dashboard.tsx';
function App() {
  

  return (
    <>
      
        
        <Routes>
          <Route path='/' element={<Layout/>}>
            {/* Public */ }
            <Route path='/login' element={<Login></Login>}/>
            <Route path='/signup' element={<SignUp></SignUp>}/>
            {/* Protected */ }
            <Route element={<RequireAuth></RequireAuth>}>
              <Route path='/' element={<Home></Home>}/>
              <Route path='*' element={<Missing></Missing>}/>
            </Route>
            <Route path='/Dashboard' element={<Dashboard></Dashboard>}/>
            {/* catch all to Missing */ }
            
          </Route>
          
          
        </Routes>
      
    </>
  )
}

export default App
