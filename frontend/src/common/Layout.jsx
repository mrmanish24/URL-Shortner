
import { Outlet } from "react-router-dom"
// import { ToastContainer } from "react-toastify";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/mycomponents/ModeToggle";

const Layout = () => {
  return (
    <div className="bg-background relative">
      <div className="absolute top-0 right-0 p-4">
        <ModeToggle />
      </div>
      {/* <ToastContainer position="top-right" /> */}
      <Toaster position="top-right" />
      <Outlet />
    </div>
  );
}
export default Layout;