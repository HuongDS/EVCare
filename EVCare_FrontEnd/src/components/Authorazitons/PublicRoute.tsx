// ../components/Authorazitons/PublicRoute.tsx

import React from "react";
import { Navigate } from "react-router-dom";
import { RoleEnum } from "../../models/enums";
import { getAccessToken, getUser } from "../../token/tokenStore";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const user = getUser();
  const token = getAccessToken();

  if (token && user) {
    switch (user.role) {
      case RoleEnum.ADMIN:
        return <Navigate to="/admin/general" replace />;
      case RoleEnum.STAFF:
        return <Navigate to="/staff/general" replace />;
      case RoleEnum.TECHNICIAN:
        return <Navigate to="/technician" replace />;
      case RoleEnum.CUSTOMER:
        return <>{children}</>;
      default:
        return <>{children}</>;
    }
  }

  return <>{children}</>;
};

export default PublicRoute;
