import { Outlet } from "react-router-dom";
import { useState,useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

function PersistLogin() {
    const [isLoading,setIsLoading] = useState(true);
    const refresh =useRefreshToken()
    const {auth,persist} = useAuth();

    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async() => {
            try{
                await refresh();
            }
            catch(error) {
                console.error(error);
            }
            finally {
                isMounted && setIsLoading(false);setIsLoading(false);
            }
        }
        auth?.token === "" ? verifyRefreshToken() : setIsLoading(false);
        return () => {isMounted = false};
    },[])

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)
        console.log(`token: ${JSON.stringify(auth.token)}`)
    },[isLoading,auth.token])
    
    return (
        <>
            {!persist
                ? <Outlet/>
                :   isLoading
                    ? <p>Loading...</p>
                    : <Outlet></Outlet>
            }
        </>
    )
}

export default PersistLogin;