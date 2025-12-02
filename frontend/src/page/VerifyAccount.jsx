import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VerifyAccount = () => {
  const server = import.meta.env.VITE_BACKEND_URL;
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  // loading | success | failed

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `${server}/api/v1/verify/${token}`
        );

        // If backend says OK
        if (res?.data?.success) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.log(err);
        setStatus("failed"); // In case of token expired or invalid
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <Card className="max-w-md w-full p-6">
        <CardHeader>
          <CardTitle className="text-center">
            {status === "loading" && "Verifying Your Account..."}
            {status === "success" && "Account Verified Successfully 🎉"}
            {status === "failed" && "Verification Failed ❌"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          {status === "loading" && <p>Please wait...</p>}

          {status === "success" && (
            <>
              <p className="text-green-500">
                Your email has been verified. You can now login.
              </p>
              <Button
                className="mt-4"
                onClick={() => (window.location.href = "/login")}
              >
                Go to Login
              </Button>
            </>
          )}

          {status === "failed" && (
            <>
              <p className="text-red-500">
                Token expired or invalid. Please register again.
              </p>
              <Button
                className="mt-4"
                onClick={() => (window.location.href = "/register")}
              >
                Register Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyAccount;
