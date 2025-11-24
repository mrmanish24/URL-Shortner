
import { Button } from "@/components/ui/button"
import { AuthContext } from "@/context/AuthContext"
import { HandGrab, Star } from "lucide-react";
import { useContext } from "react"

const Home = () => {
  const {user,logoutUser} = useContext(AuthContext);

  if (!user || !user.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="dark:text-white text-black text-2xl font-bold">Loading...</p>
      </div>
    );
  }
    const username = user.user.name;

  return (
    <div className="">
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col">
          <h1 className="dark:text-white text-black">
            <Star/>
            welcome to Home{" "}
            <span className="font-bold text-2xl text-primary">
              {" "}
              {username.toUpperCase()}
            </span>
          </h1>
          <div className="flex justify-center items-center mt-5">
            <Button variant="destructive" className="cursor-pointer" onClick={logoutUser}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home