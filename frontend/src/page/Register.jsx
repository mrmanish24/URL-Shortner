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
import {  registerSchema } from "@/config/zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, MessageCircle, MessageCircleHeart, Projector, User } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";



const Register = () => {
  const methods = useForm({
    resolver: zodResolver(registerSchema),
    mode : "onBlur"
  });
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data)
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
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email below to create to your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 4. CARD CONTENT (Inputs and Spacing) */}
            <CardContent className="">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="username">
                      {" "}
                      <User /> Username
                    </FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="username"
                      className=""
                      {...register("username", {
                        required: "username is required",
                      })}
                    />
                    <FieldError className="">
                      {errors.username?.message}
                    </FieldError>
                  </Field>

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
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>
              <div className="flex items-center justify-between">
                <CardDescription>Already have an account.</CardDescription>
                <CardAction>
                  <Link to="/login">
                    <Button variant="link">Login</Button>
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


export default Register;