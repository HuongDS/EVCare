import { Navigate } from "react-router";
import type { RoleEnum } from "../../models/enums";
import { getAccessToken, getUser } from "../../token/tokenStore";

interface ProtectedRouteProps {
  allowedRoles: RoleEnum[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const user = getUser();
  const token = getAccessToken();

  if (!token || !user) {
    return <Navigate to="/" replace></Navigate>;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace></Navigate>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
