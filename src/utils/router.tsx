import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";
import { getAccessToken } from "../lib/auth";
import Auth from "../pages/Auth";
import Issues from "../pages/Issues";
import Repos from "./../pages/Repos";
import { clearAccessToken } from "./../lib/auth";
import { ReactElement, ReactNode } from "react";
import IssuesPR from "../pages/IssuesPR";

interface FCProp {
  children: ReactElement;
}

const RequireAuth = ({ children }: FCProp) => {
  const token = getAccessToken();
  if (!token) return <Navigate to="/auth" />;

  return children;
};
const RedirectIfLoggedIn = ({ children }: FCProp) => {
  const token = getAccessToken();
  if (token != null) return <Navigate to="/" />;

  return children;
};

const LogOut = () => {
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
    path: "/app",
    element: (
      <RequireAuth>
        <Repos />
      </RequireAuth>
    ),
  },
  {
    path: "/app/:owner/:repo",
    element: <IssuesPR />,
  },
  {
    path: "/logout",
    element: <LogOut />,
  },
  {
    path: "*",
    element: <Navigate to="/app" />,
  },
]);
export default router;
