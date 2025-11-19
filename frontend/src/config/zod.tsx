import z, { email, number } from "zod";

export const loginSchema = z.object({
    email : z.string().email("Invalid email format"),
    password : z.string().min(4,"Minimum 4 char")
})


export const registerSchema = z.object({
username : z.string().min(4,"Minium 4 char required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(4, "Minimum 4 char required"),
});