import Cookies from "js-cookie";
import type { LoginRequest, LoginResponse, RegisterRequest, User } from "../types/api";
import { COOKIES, COOKIE_OPTIONS } from "../configs/cookies";
import httpClient from "./httpClient";

// Авторизация - получение токенов
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await httpClient<{ access: string; refresh: string }>({
    url: "token/",
    method: "POST",
    data,
  });

  const { access, refresh } = response.data;

  // Сохраняем токены в куки
  Cookies.set(COOKIES.ACCESS_TOKEN, access, COOKIE_OPTIONS);
  Cookies.set(COOKIES.REFRESH_TOKEN, refresh, COOKIE_OPTIONS);

  // Получаем данные пользователя
  const userResponse = await httpClient<User>({
    url: "users/me/",
  });

  return {
    email: userResponse.data.email,
    role: userResponse.data.role,
    token: access,
  };
};

// Обновление токена
export const refreshToken = async (refresh: string) => {
  const response = await httpClient<{ access: string }>({
    url: "token/refresh/",
    method: "POST",
    data: { refresh },
  });

  const { access } = response.data;
  Cookies.set(COOKIES.ACCESS_TOKEN, access, COOKIE_OPTIONS);
  return access;
};

// Выход из системы
export const logout = () => {
  Cookies.remove(COOKIES.ACCESS_TOKEN);
  Cookies.remove(COOKIES.REFRESH_TOKEN);
  Cookies.remove(COOKIES.USER_ROLE);
  Cookies.remove(COOKIES.USER_EMAIL);
};

export const register = (data: RegisterRequest) =>
  httpClient<User>({
    url: "users/register/",
    method: "POST",
    data,
  });
