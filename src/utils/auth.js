import Cookies from "js-cookie";
const tokenName = import.meta.env.VITE_TOKEN || "satoken";

export function getToken() {
  return Cookies.get(tokenName);
}

export function setToken(token, config) {
  return Cookies.set(tokenName, token, config);
}

export function removeToken() {
  return Cookies.remove(tokenName);
}
