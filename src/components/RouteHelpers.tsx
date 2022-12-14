import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken, clearAccessToken } from "../lib/auth";

interface FCProp {
  children: ReactElement;
}

export const RequireAuth = () => {
  const token = getAccessToken();
  if (!token) return <Navigate to="/auth" />;

  return <Outlet />;
};
export const RedirectIfLoggedIn = ({ children }: FCProp) => {
  const token = getAccessToken();
  if (token !== null) return <Navigate to="/" />;

  return children;
};

export const LogOut = () => {
  clearAccessToken();
  return <Navigate to="/auth" />;
};
