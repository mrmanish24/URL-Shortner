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
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useContext } from "react";

import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const methods = useForm({
  });
  const {fetchUser} = useContext(AuthContext);
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (formData) => {
    const {otp} = formData;
    const email = localStorage.getItem("email")
    try {
     const {data} = await axios.post("http://localhost:9034/api/v1/verify",{email, otp},{
        withCredentials: true
      });
      toast.success(data?.message)
      await fetchUser();
      navigate("/home");
    } catch (error) {
      toast.error(error?.response?.error?.message)
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
              One Time Password
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              OTP has been sent to your register email
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 4. CARD CONTENT (Inputs and Spacing) */}
            <CardContent className="">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="1234"
                      className=""
                      {...register("otp", {
                        required: "OTP is required",
                      })}
                    />
                    <FieldError className="">
                      {errors.otp?.message}
                    </FieldError>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </CardContent>

            <CardFooter className="flex-col gap-2 mt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>
              <div className="flex items-center justify-between">
                <CardDescription>Go to login page</CardDescription>
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

export default VerifyOtp;