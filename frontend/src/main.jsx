
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './common/ErrorPage'
import Login from './page/Login'
import Register from './page/Register'
import VerifyOtp from './page/VerifyOtp'
import Home from './page/Home'
import Layout from './common/Layout'
import Hero from './page/Hero'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './common/ProtectedRoute'


const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      {
        index: true, 
        element: <Hero />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "verify",
        element: <VerifyOtp />,
      },

      // 🔥 PROTECTED ROUTES START HERE
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "home",
            element: <Home />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
