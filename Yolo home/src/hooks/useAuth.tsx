import { useContext } from "react";

import { AuthContext } from "../context/AuthProvide";
const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;