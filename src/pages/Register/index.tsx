import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { register as registerUser } from "../../api/auth";
import S from "../Auth/Auth.module.scss";
import classNames from "classnames";

interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterDto>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const password = watch("password");

  const onSubmit = async (form: RegisterDto) => {
    try {
      await registerUser({
        email: form.email,
        password: form.password,
        password2: form.confirmPassword,
      });
      navigate("/auth");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
  };

  return (
    <div className={S.authWrap}>
      <div className={S.authContainer}>
        <div className={S.header}>Регистрация</div>
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
                  value: /^[a-zA-Z0-9._%-]+@mpt\.ru$/,
                  message: "Используйте только корпоративную почту @mpt.ru",
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

          <div>
            <input
              type="password"
              id="confirmPassword"
              required
              className={classNames(S.input, errors.confirmPassword?.message && S.inputError)}
              placeholder="Подтвердите пароль"
              {...register("confirmPassword", {
                required: { value: true, message: "Поле обязательно для заполнения" },
                validate: (value) => value === password || "Пароли не совпадают",
              })}
            />
            {errors.confirmPassword && <span className={S.error}>{errors.confirmPassword.message}</span>}
          </div>

          <button disabled={!isValid} type="submit" className={S.submitButton}>
            Зарегистрироваться
          </button>

          <div className={S.links}>
            <Link to="/auth" className={S.registerLink}>
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
