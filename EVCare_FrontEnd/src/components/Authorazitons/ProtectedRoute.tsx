import { Navigate, Outlet } from "react-router";
import type { RoleEnum } from "../../models/enums";
import { getAccessToken, getUser } from "../../token/tokenStore";

interface ProtectedRouteProps {
  allowedRoles: RoleEnum[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = getUser();
  const token = getAccessToken();

  if (!token || !user) {
    return <Navigate to="/" replace></Navigate>;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace></Navigate>;
  }

  return <Outlet></Outlet>;
};

export default ProtectedRoute;
