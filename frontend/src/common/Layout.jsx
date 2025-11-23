
import { Outlet } from "react-router-dom"
// import { ToastContainer } from "react-toastify";
import { Toaster } from "@/components/ui/sonner";

const Layout = () => {
  return (
    <div className="bg-background relative">
      {/* <ToastContainer position="top-right" /> */}
      <Toaster position="top-right"/>
      <Outlet />
    </div>
  );
}
export default Layout;