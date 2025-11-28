import { AuthContext } from "@/context/AuthContext"
import { Children, useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import Loading from "./Loading";
import { toast } from "sonner";

const ProtectedRoute = ({children}) => {

const {isAuth,user, isLoading} = useContext(AuthContext);
if(isLoading){
  return (
    <div className="h-screen flex justify-center items-center">
      <p className="text-2xl dark:text-white text-black">Checking authentication...</p>
    </div>
  );
}
console.log("protected route working","user:" ,user)

if (isAuth === null){
  return <Loading/>
}

if (isAuth === false) {
  toast.info("Not Authenticated");
  return <Navigate to="/login" replace/>;
}

console.log("rediret to home", "user:", user);
  return (
     children
  )
}
export default ProtectedRoute;