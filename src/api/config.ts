export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
