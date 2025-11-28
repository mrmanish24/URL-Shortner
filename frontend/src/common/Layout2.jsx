
import { Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner";
import { Navbar2 } from "./NavBar2";

const Layout2 = () => {
  return (
    <div className="bg-background relative">
      {/* <ToastContainer position="top-right" /> */}
      <Toaster position="top-right" />
      <Navbar2 />
      <Outlet />
    </div>
  );
}
export default Layout2;