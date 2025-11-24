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

const router = createBrowserRouter([
  {
    //Non auth route
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Layout />
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
      },
      {
        path: "verify",
        element: <VerifyOtp />,
      },
      {
        path: "token/:token",
        element: <VerifyAccount/>,
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
        errorElement: <ErrorPage />,
        element: (
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

// const router = createBrowserRouter([

//   {
//     path: "/",
//     errorElement: <ErrorPage />,
//     element: (
//       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
//         <AuthProvider>
//           <Layout />
//         </AuthProvider>
//       </ThemeProvider>
//     ),
//     children: [
//       {
//         index: true,
//         element: <Hero />,
//       },
//       {
//         path: "login",
//         element: <Login />,
//       },
//       {
//         path: "register",
//         element: <Register />,
//       },
//       {
//         path: "verify",
//         element: <VerifyOtp />,
//       },

//       // 🔥 PROTECTED ROUTES START HERE
//       {
//         element: <ProtectedRoute />,
//         children: [
//           {
//             path: "home",
//             element: <Home />,
//           },
//         ],
//       },
//     ],
//   },
// ]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
