import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getApplications, updateApplication } from "../../api/applications";
import type { Application } from "../../types/api";
import S from "./Application.module.scss";
import { useNavigate } from "react-router-dom";

const ApplicationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        setError("Необходима авторизация");
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await getApplications();
        // Сортируем заявки по дате создания (новые сверху)
        const sortedApplications = data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setApplications(sortedApplications);
      } catch (error) {
        setError("Ошибка при загрузке заявок");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const handleStatusChange = async (id: number, newStatus: "new" | "in_progress" | "completed" | "rejected") => {
    if (user?.role !== "admin") return;

    try {
      await updateApplication(id, { status: newStatus });
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)));
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
      alert("Не удалось обновить статус заявки");
    }
  };

  const getApplicationCountText = (count: number): string => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return "заявок";
    }

    switch (lastDigit) {
      case 1:
        return "заявка";
      case 2:
      case 3:
      case 4:
        return "заявки";
      default:
        return "заявок";
    }
  };

  if (!user) {
    return <div className={S.error}>Необходима авторизация</div>;
  }

  if (isLoading) {
    return <div className={S.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={S.error}>{error}</div>;
  }

  return (
    <div className={S.applicationWrap}>
      <div className={S.applicationContainer}>
        <div className={S.header}>
          {user.role === "admin" ? "Все заявки" : "Мои заявки"}
          <span className={S.count}>
            {applications.length} {getApplicationCountText(applications.length)}
          </span>
        </div>

        {applications.length === 0 ? (
          <div className={S.emptyState}>{user.role === "admin" ? "Нет активных заявок" : "У вас пока нет заявок"}</div>
        ) : (
          <div className={S.applicationsList}>
            {applications.map((app) => (
              <div className={S.applicationCard} key={app.id}>
                <div className={S.applicationTitle}>{app.title}</div>

                <div className={S.applicationInfo}>
                  <span>Описание: {app.description}</span>
                  {user.role === "admin" && (
                    <>
                      <div>От: {app.user_email}</div>
                      <div>Создано: {new Date(app.created_at).toLocaleDateString()}</div>
                      {app.admin_comment && <div>Комментарий администратора: {app.admin_comment}</div>}
                      {app.image_url && (
                        <div className={S.imageContainer}>
                          <a
                            href={app.image_url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className={S.downloadButton}
                          >
                            Скачать фото пользователя
                          </a>
                        </div>
                      )}
                      {app.admin_image_url && (
                        <div className={S.imageContainer}>
                          <a
                            href={app.admin_image_url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className={S.downloadButton}
                          >
                            Скачать фото ответа администратора
                          </a>
                        </div>
                      )}
                    </>
                  )}
                  {app.image_url && user.role !== "admin" && (
                    <div className={S.imageContainer}>
                      <img src={app.image_url} alt="Фото к заявке" className={S.applicationImage} />
                      <a
                        href={app.image_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className={S.downloadButton}
                      >
                        Скачать фото к заявке
                      </a>
                    </div>
                  )}
                </div>

                <div className={S.applicationStatus}>
                  {user.role === "admin" ? (
                    <>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as "new" | "in_progress" | "completed" | "rejected")
                        }
                        className={S.statusSelect}
                      >
                        <option value="new">В ожидании</option>
                        <option value="in_progress">В обработке</option>
                        <option value="completed">Решено</option>
                        <option value="rejected">Отклонено</option>
                      </select>
                      <button onClick={() => navigate(`/application/${app.id}/respond`)} className={S.respondButton}>
                        Ответить
                      </button>
                    </>
                  ) : (
                    <span className={`${S.statusText} ${S[app.status]}`}>Статус: {app.status_display}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationPage;
