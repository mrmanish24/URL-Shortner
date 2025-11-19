import { AuthContext } from "@/context/AuthContext"
import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import Loading from "./Loading";
import Login from "@/page/Login";
import { toast } from "sonner";

const ProtectedRoute = () => {
const {isAuth} = useContext(AuthContext);

if (isAuth === null){
  return <Loading/>
}

if (isAuth === false) {
  toast.info("Not Authenticated")
  return <Navigate to="/login" replace/>;
}
  return (
    <Outlet/>
  )
}
export default ProtectedRoute;