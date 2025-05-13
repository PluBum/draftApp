import Cookies from "js-cookie";

interface CookieData {
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
  user_id: number;
}

export const COOKIE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export function getCookieData(token: string): CookieData {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid token format");

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload) as CookieData;
  } catch {
    throw new Error("Failed to decode token");
  }
}

export const saveTokens = (access: string, refresh: string) => {
  const accessExpires = new Date(getCookieData(access).exp * 1000);
  const refreshExpires = new Date(getCookieData(refresh).exp * 1000);

  Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, access, {
    expires: accessExpires,
    sameSite: "strict",
  });

  Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, refresh, {
    expires: refreshExpires,
    sameSite: "strict",
  });
};

export const getTokens = () => {
  const accessToken = Cookies.get(COOKIE_KEYS.ACCESS_TOKEN);
  const refreshToken = Cookies.get(COOKIE_KEYS.REFRESH_TOKEN);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
};

export const removeTokens = () => {
  Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN);
  Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = getCookieData(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};
