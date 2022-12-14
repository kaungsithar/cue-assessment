import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
} from "react-router-dom";
import { getAccessToken } from "./lib/auth";
import Auth from "./pages/Auth";
import Issues from "./pages/Issues";
import Repos from "./pages/Repos";
import { clearAccessToken } from "./lib/auth";
import { ReactElement, ReactNode } from "react";
import IssuesPR from "./pages/IssuesPR";

interface FCProp {
  children: ReactElement;
}

const RequireAuth = () => {
  const token = getAccessToken();
  if (!token) return <Navigate to="/auth" />;

  return <Outlet />;
};
const RedirectIfLoggedIn = ({ children }: FCProp) => {
  const token = getAccessToken();
  if (token !== null) return <Navigate to="/" />;

  return children;
};

export const LogOut = () => {
  clearAccessToken();
  return <Navigate to="/auth" />;
};

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
