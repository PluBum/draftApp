import type { User } from "../types/api";
import httpClient from "./httpClient";

export const getCurrentUser = () =>
  httpClient<User>({
    url: "users/me/",
  });
