import z, { email, number } from "zod";

export const loginSchema = z.object({
    email : z.string().email("Invalid email format"),
    password : z.string().min(4,"Minimum 4 char")
})


export const registerSchema = z.object({
  name : z.string().min(4,"Minium 4 char required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(4, "Minimum 4 char required"),
});

export const urlSchema = z.object({
  url : z.string().min(1,"URL is required")
  .refine((value) => !value.startsWith("https://") && !value.startsWith("http://"), {
      message: "Remove https:// or http:// — it will be added automatically",
    }),

      shortUrlRoute: z.string().optional(),

})
