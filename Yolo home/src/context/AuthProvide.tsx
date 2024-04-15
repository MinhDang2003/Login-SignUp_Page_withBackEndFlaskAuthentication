import React, { createContext, useState ,ReactNode} from 'react';

interface AuthProps {
    children: ReactNode;
}
interface Auth {
    token: string;
}
interface IAuthContext {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}
const defaultAuth: Auth = {
    token: '',
};
const defaultSetAuth: React.Dispatch<React.SetStateAction<Auth>> = (newAuth: Auth | ((prevState: Auth) => Auth)) => {
    
    if (typeof newAuth === 'function') {
      const newState = (newAuth)(defaultAuth);
      return newState;
    }
    return newAuth;
  };
  const defaultSetPersist: React.Dispatch<React.SetStateAction<boolean>> = (newPersist: boolean | ((prevState: boolean) => boolean)) => {
    
    if (typeof newPersist === 'function') {
      const newState = (newPersist)(Boolean(JSON.parse(localStorage.getItem("persist") || "false")));
      return newState;
    }
    return newPersist;
  };
const defaultIAuthContext: IAuthContext = {
    auth: defaultAuth,
    setAuth: defaultSetAuth,
    persist: Boolean(JSON.parse(localStorage.getItem("persist") || "false")),
    setPersist: defaultSetPersist
  };
export const AuthContext = createContext<IAuthContext>(defaultIAuthContext);

const AuthProvider: React.FC<AuthProps> = ({ children }) => {
    const [auth, setAuth] = useState<Auth>({token:""});
    const [persist,setPersist] = useState<boolean>(Boolean(JSON.parse(localStorage.getItem("persist") || "false")))
    return (
      <AuthContext.Provider value={{ auth, setAuth , persist , setPersist}}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export default AuthProvider;
