const localStorageKey = "gh_token";

export function setAccessToken(token: string) {
  localStorage.setItem(localStorageKey, token);
}
export function getAccessToken() {
  return localStorage.getItem(localStorageKey);
}

export function clearAccessToken() {
  localStorage.removeItem(localStorageKey);
}