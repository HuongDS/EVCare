import { jwtDecode } from "jwt-decode";
import type { User } from "../models/AuthModel/authModel";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { RoleEnum } from "../models/enums";

export function decodeJwt(token: string) {
  const payload = jwtDecode<Record<string, unknown>>(token);
  return payload;
}

export function toUseFromJwt(token: string): User {
  const p = decodeJwt(token);
  const rawRole = String(p["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
  const newUser: User = {
    accountId: Number(p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]),
    email: String(p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]),
    role: mapToRoleEnum(rawRole),
  };
  const exp = Number(p.exp);
  if (!exp || exp * 1000 <= Date.now()) {
    alert(ERROR_MESSAGE.TOKEN_HAS_EXPIRED);
  }
  return newUser;
}

function mapToRoleEnum(role: string) {
  switch (role) {
    case "Admin":
      return RoleEnum.ADMIN;
    case "Staff":
      return RoleEnum.STAFF;
    case "Technician":
      return RoleEnum.TECHNICIAN;
    default:
      return RoleEnum.CUSTOMER;
  }
}
