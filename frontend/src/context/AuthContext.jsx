
import api from "@/apiintercepter";
import { createContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";



export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(null);
  const [user , setUser] = useState(null);

  const fetchUser = async () =>{
    try {
      const { data } = await api.get("/api/v1/me");
      setIsAuth(true); // 👈 State update is scheduled, not executed yet. after render it will show
      setUser(data);
      console.log("value of is ", isAuth, "user data: ", data);
    } catch (error) {
      setIsAuth(false);
     console.log(error?.response?.data?.message || "Failed to Authenticate")
    }
  }
const logoutUser = async () => {
  try {
    const { data } = await api.post("/api/v1/logout");
    toast.success(data.message);

    setIsAuth(false);
    setUser(null);

    navigate("/login", { replace: true });
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong");
  }
};

  useEffect(()=>{
    fetchUser();
  },[]);

  return <AuthContext.Provider value={{user, isAuth, fetchUser,logoutUser}}>
    {children}
  </AuthContext.Provider>
}