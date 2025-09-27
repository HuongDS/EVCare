import { jwtDecode } from "jwt-decode";
import type { JwtPayLoad } from "../models/AuthModel/authModel";
import { ERROR_MESSAGE } from "../constants/messages/Message";

export function decodeJwt(token: string) {
  const payload = jwtDecode<JwtPayLoad>(token);
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    throw new Error(ERROR_MESSAGE.TOKEN_HAS_EXPIRED);
  }
  return payload;
}
