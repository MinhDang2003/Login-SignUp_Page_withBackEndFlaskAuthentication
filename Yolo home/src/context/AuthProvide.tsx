import React, { createContext, useState ,ReactNode} from 'react';

interface AuthProps {
    children: ReactNode;
}
interface Auth {
    token: string;
    refresh: string;
}
interface IAuthContext {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}
const defaultAuth: Auth = {
    token: '',
    refresh: '',
};
const defaultSetAuth: React.Dispatch<React.SetStateAction<Auth>> = (newAuth: Auth | ((prevState: Auth) => Auth)) => {
    
    if (typeof newAuth === 'function') {
      const newState = (newAuth)(defaultAuth);
      
      console.log(newState)
      return newState;
    }
    
    return newAuth;
  };
const defaultIAuthContext: IAuthContext = {
    auth: defaultAuth,
    setAuth: defaultSetAuth,
  };
export const AuthContext = createContext<IAuthContext>(defaultIAuthContext);

const AuthProvider: React.FC<AuthProps> = ({ children }) => {
    const [auth, setAuth] = useState<Auth>({token:"",refresh:""});
    
    return (
      <AuthContext.Provider value={{ auth, setAuth }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export default AuthProvider;
