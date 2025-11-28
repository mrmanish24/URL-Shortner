import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./common/ErrorPage";
import Login from "./page/Login";
import Register from "./page/Register";
import VerifyOtp from "./page/VerifyOtp";
import Home from "./page/Home";
import Layout from "./common/Layout";
import Hero from "./page/Hero";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./common/ProtectedRoute";
import { ThemeProvider } from "./context/theme-provider";
import VerifyAccount from "./page/VerifyAccount";
import Home2 from "./page/Home2";
import Analytics from "./page/Analytics";
import Layout2 from "./common/Layout2";


const router = createBrowserRouter([
  {
    //Non auth route
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Layout2 />
        </AuthProvider>
      </ThemeProvider>
    ),
    children: [
      {
        index: true,
        errorElement: <ErrorPage />,
        element: <Hero />,
      },
      {
        path: "register",
        element: <Register />,
        errorElement: <ErrorPage />,
      },
      {
        path: "verify",
        element: <VerifyOtp />,
        errorElement: <ErrorPage />,
      },
      {
        path: "token/:token",
        element: <VerifyAccount />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    // auth route
    element: (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </ThemeProvider>
    ),
    children: [
      {
        path: "login",
        errorElement: <ErrorPage />,
        element: <Login />,
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home2 />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "analytics",
        errorElement: <ErrorPage />,
        element: (
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
