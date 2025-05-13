import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getApplication, respondToApplication } from "../../api/applications";
import type { Application } from "../../types/api";
import S from "./ApplicationRespond.module.scss";

const ApplicationRespondPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [employeeName, setEmployeeName] = useState("");
  const [room, setRoom] = useState("");
  const [adminImage, setAdminImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!user || user.role !== "admin") {
        setError("Доступ запрещен");
        setIsLoading(false);
        return;
      }

      try {
        if (!id) {
          setError("ID заявки не указан");
          setIsLoading(false);
          return;
        }

        const { data } = await getApplication(Number(id));
        setApplication(data);
      } catch (error) {
        setError("Ошибка при загрузке заявки");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [user, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !employeeName.trim() || !room.trim()) return;

    try {
      const formData = new FormData();
      formData.append("employee_name", employeeName);
      formData.append("room", room);
      if (adminImage) {
        formData.append("admin_image", adminImage);
      }

      await respondToApplication(Number(id), formData);
      navigate("/application");
    } catch (error) {
      console.error("Ошибка при отправке ответа:", error);
      setError("Не удалось отправить ответ");
    }
  };

  if (!user || user.role !== "admin") {
    return <div className={S.error}>Доступ запрещен</div>;
  }

  if (isLoading) {
    return <div className={S.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={S.error}>{error}</div>;
  }

  if (!application) {
    return <div className={S.error}>Заявка не найдена</div>;
  }

  return (
    <div className={S.respondWrap}>
      <div className={S.respondContainer}>
        <h1 className={S.title}>Ответ на заявку</h1>

        <div className={S.applicationInfo}>
          <h2>{application.title}</h2>
          <p>{application.description}</p>
          <p>От: {application.user_email}</p>
          <p>Создано: {new Date(application.created_at).toLocaleDateString()}</p>
        </div>

        <form onSubmit={handleSubmit} className={S.form}>
          <div className={S.formGroup}>
            <label htmlFor="employeeName" className={S.label}>
              ФИО сотрудника:
              <input
                type="text"
                id="employeeName"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
                className={S.input}
              />
            </label>

            <label htmlFor="room" className={S.label}>
              Номер аудитории в которой находится неисправное оборудование:
              <input
                type="text"
                id="room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                required
                className={S.input}
              />
            </label>

            <label className={S.label}>
              Приложить изображение (не обязательно)
              <input
                type="file"
                accept="image/*"
                className={S.fileInput}
                onChange={(e) => setAdminImage(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className={S.buttons}>
            <button type="button" onClick={() => navigate("/application")} className={S.cancelButton}>
              Отмена
            </button>
            <button type="submit" className={S.submitButton} disabled={isLoading}>
              {isLoading ? "Отправка..." : "Отправить ответ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationRespondPage;
