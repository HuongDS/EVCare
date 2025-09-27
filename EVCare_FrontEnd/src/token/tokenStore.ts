import type { User } from "../models/AuthModel/authModel";

const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_KEY;
const AUTH_USER = import.meta.env.VITE_USER_KEY;

// token
export function setTokens(accessToken: string) {
  sessionStorage.setItem(ACCESS_TOKEN, accessToken);
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN);
}

export function clearToken() {
  sessionStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(AUTH_USER);
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

// user
export function saveUser(user: User) {
  localStorage.setItem(AUTH_USER, JSON.stringify(user));
}

export function getUser(): User | null {
  const user = localStorage.getItem(AUTH_USER);
  return user ? (JSON.parse(user) as User) : null;
}
