
import api from "@/apiintercepter";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();


export const AuthProvider = ({children}) =>{
  const [isAuth, setIsAuth] = useState(null);
  const [user , setUser] = useState(null);

  const fetchUser = async () =>{
    try {
      const { data } = await api.get("/api/v1/me");
      setIsAuth(true);
      setUser(data);
      console.log(isAuth , data)
    } catch (error) {
      setIsAuth(false);
     console.log(error?.response?.data?.message || "Failed to Authenticate")
    }
  }
  useEffect(()=>{
    fetchUser();
  },[]);

  return <AuthContext.Provider value={{user, isAuth, fetchUser}}>
    {children}
  </AuthContext.Provider>
}