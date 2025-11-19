
import { Button } from "@/components/ui/button"
import { AuthContext } from "@/context/AuthContext"
import axios from "axios"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import { toast } from "sonner"
const Home = () => {
  const navigate = useNavigate()
  const {user} = useContext(AuthContext);
  const handleClick = async () =>{
    try {
     await axios.post("http://localhost:9034/api/v1/logout",user ,{
      withCredentials : true
     });
     toast.success("Logged Out")
     navigate("/login")
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  return (
    <div>
      welcome to Home 
      <Button variant="destructive" onClick={handleClick}>Logout</Button>
    </div>
  )
}
export default Home