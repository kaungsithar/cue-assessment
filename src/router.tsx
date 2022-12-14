import { createBrowserRouter, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Repos from "./pages/Repos";
import IssuesPR from "./pages/IssuesPR";
import {
  RedirectIfLoggedIn,
  LogOut,
  RequireAuth,
} from "./components/RouteHelpers";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <RedirectIfLoggedIn>
        <Auth />
      </RedirectIfLoggedIn>
    ),
  },
  {
    path: "/logout",
    element: <LogOut />,
  },
  {
    path: "/app",
    element: <RequireAuth />,
    children: [
      {
        index: true,
        element: <Repos />,
      },
      {
        path: ":owner/:repo",
        element: <IssuesPR />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/app" />,
  },
]);
export default router;
