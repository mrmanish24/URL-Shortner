
import { Button } from "@/components/ui/button"
import { AuthContext } from "@/context/AuthContext"
import { useContext } from "react"

const Home = () => {
  const {user,logoutUser} = useContext(AuthContext);
  const username = user.user.name;
  return (
    <div className="">
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col">
          <h1>
            welcome to Home{" "}
            <span className="font-bold text-2xl text-primary">
              {" "}
              {username.toUpperCase()}
            </span>
          </h1>
          <div className="flex justify-center items-center mt-5">
            <Button variant="destructive" onClick={logoutUser}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home