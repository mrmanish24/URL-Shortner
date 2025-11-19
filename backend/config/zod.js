
import { email } from "zod";
import {z} from "zod";
const registerSchema = z.object({
    name : z.string().min(3,"name must be 3 character long"),
    email : z.string().email("invalid email format"),
    password: z.string().min(4,"password must be 4 char long")
})

const loginSchema = z.object({
  email: z.string().email("invalid email format"),
  password: z.string().min(4, "password must be 4 char long"),
});




export {
registerSchema,
loginSchema
}