import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import httpClient from "../api/httpClient";
import type { User } from "../types/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Компонент для защиты маршрутов админа
export const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/send" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Компонент для защиты маршрутов обычного пользователя
export const UserRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/application" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const response = await httpClient<User>({
            url: "users/me/",
          });
          setUser({
            email: response.data.email,
            role: response.data.role,
          });
        } catch (error) {
          console.error("Ошибка получения данных пользователя:", error);
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [token, user, setUser]);

  // Список публичных маршрутов, которые не требуют авторизации
  const publicRoutes = ["/auth", "/register"];

  if (isLoading) {
    return null;
  }

  // Если текущий маршрут не в списке публичных и нет токена/пользователя
  if (!publicRoutes.includes(location.pathname) && (!user || !token)) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Перенаправление пользователя после авторизации на соответствующую страницу
  if (user && publicRoutes.includes(location.pathname)) {
    if (user.role === "admin") {
      return <Navigate to="/application" replace />;
    } else {
      return <Navigate to="/send" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
