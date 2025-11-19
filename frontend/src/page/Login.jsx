import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/config/zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, MessageCircleHeart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";



const Login = () => {
   const navigate = useNavigate();
  const methods = useForm({
    resolver: zodResolver(loginSchema),
  });
 
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (formData) => {
    try {
      const { data } = await axios.post(
        "http://localhost:9034/api/v1/login",
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      localStorage.setItem("email" ,formData.email)
      navigate("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };


  return (
    // 1. OUTER CONTAINER (Centering and Background)
    <div className="min-h-screen w-full flex justify-center items-center px-4">
      <FormProvider {...methods}>
        {/* 2. CARD CONTAINER (Sizing and Appearance) */}
        <Card className="w-full max-w-xs sm:max-w-sm  md:max-w-md px-4 py-6 sm:px-6 sm:py-8">
          {/* 3. CARD HEADER (Title and Link) */}
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">
              Login to your account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 4. CARD CONTENT (Inputs and Spacing) */}
            <CardContent className="">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">
                      <MessageCircleHeart /> Email Address
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      className=""
                      {...register("email")}
                    />
                    <FieldError className="">
                      {errors.email?.message}
                    </FieldError>
                  </Field>

                  {/* Password Field */}
                  <Field>
                    <FieldLabel htmlFor="password" className="">
                      <Lock />
                      Password
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className=""
                      {...register("password")}
                    />
                    <FieldError className="">
                      {errors.password?.message}
                    </FieldError>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </CardContent>

            <CardFooter className="flex-col gap-2 mt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging In..." : "Login"}
              </Button>
              <div className="flex items-center justify-between">
                <CardDescription>Don't have an Account</CardDescription>
                <CardAction>
                  <Link to="/register">
                    <Button variant="link">Sign Up</Button>
                  </Link>
                </CardAction>
              </div>
            </CardFooter>
          </form>
        </Card>
      </FormProvider>
    </div>
  );
};


export default Login;