import { createBrowserRouter } from "react-router-dom";
import Posts from "../pages/Posts";
import Profile from "../pages/Profile";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";

export const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <Posts />,
    errorElement: <h1>Not found...</h1>,
    children: [{ index: true, element: <Posts /> }],
  },
  { path: "signup", element: <Signup /> },
  { path: "signin", element: <Signin /> },
  { path: "profile/:id", element: <Profile /> },
]);
