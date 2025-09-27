const ACCESS_TOKEN = import.meta.env
  .VITE_ACCESS_KEY;

export function setTokens(accessToken: string) {
  sessionStorage.setItem(
    ACCESS_TOKEN,
    accessToken
  );
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN);
}

export function clearToken() {
  sessionStorage.removeItem(ACCESS_TOKEN);
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}
