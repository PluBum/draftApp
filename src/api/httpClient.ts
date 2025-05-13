import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { COOKIES } from "../configs/cookies";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

axios.defaults.baseURL = API_URL;

const httpClient = <T>({ method = "GET", url, data, params, headers }: AxiosRequestConfig) =>
  axios<T>({
    method,
    url,
    data,
    params,
    headers: {
      ...headers,
      Authorization: Cookies.get(COOKIES.ACCESS_TOKEN) ? `Bearer ${Cookies.get(COOKIES.ACCESS_TOKEN)}` : "",
    },
  });

export default httpClient;
