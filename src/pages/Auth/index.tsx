import { useForm } from "react-hook-form";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";
import S from "./Auth.module.scss";
import classNames from "classnames";
import Cookies from "js-cookie";

interface AuthDto {
  email: string;
  password: string;
}

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AuthDto>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit = async (form: AuthDto) => {
    try {
      const data = await login({
        email: form.email,
        password: form.password,
      });

      // Сохраняем токен в куки
      Cookies.set("token", data.token, { expires: 7 }); // токен на 7 дней

      // Сохраняем информацию о пользователе в контексте
      setUser({
        email: data.email,
        role: data.role,
      });

      // Перенаправляем на страницу в зависимости от роли пользователя
      const defaultPath = data.role === "admin" ? "/application" : "/send";
      const from = location.state?.from?.pathname || defaultPath;
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Ошибка авторизации:", error);
    }
  };

  return (
    <div className={S.authWrap}>
      <div className={S.authContainer}>
        <div className={S.header}>Вход в систему</div>
        <form className={S.form} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="email"
              id="email"
              required
              className={classNames(S.input, errors.email?.message && S.inputError)}
              placeholder="Email"
              {...register("email", {
                required: { value: true, message: "Поле обязательно для заполнения" },
                pattern: {
                  value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                  message: "Введите корректный email",
                },
              })}
            />
            {errors.email && <span className={S.error}>{errors.email.message}</span>}
          </div>

          <div>
            <input
              type="password"
              id="password"
              required
              className={classNames(S.input, errors.password?.message && S.inputError)}
              placeholder="Пароль"
              {...register("password", {
                required: { value: true, message: "Поле обязательно для заполнения" },
                minLength: { value: 6, message: "Минимум 6 символов" },
              })}
            />
            {errors.password && <span className={S.error}>{errors.password.message}</span>}
          </div>

          <button disabled={!isValid} type="submit" className={S.submitButton}>
            Войти
          </button>

          <div className={S.links}>
            <Link to="/register" className={S.registerLink}>
              Регистрация
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
