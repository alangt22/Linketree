import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Admin } from "./pages/admin";
import { Networks } from "./pages/networks";
import { ErrorPage } from "./pages/error";
import { Private } from "./routes/private";
import { RegisterPage } from "./pages/register";
import { PublicProfile } from "./pages/public";



const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <Private>
        <Admin />
      </Private>
    ),
  },
  {
    path: "/admin/social",
    element: (
      <Private>
        <Networks />
      </Private>
    ),
  },
  {
    path:'/u/:userId',
    element: <PublicProfile/>
  },
  {
    path: "*",
    element: <ErrorPage />,
  }
]);

export { router };
