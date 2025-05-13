import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getApplications } from "../../api/applications";
import type { Application } from "../../types/api";
import { useNavigate } from "react-router-dom";
import S from "./UserApplications.module.scss";

const UserApplicationsPage = () => {
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
          Мои заявки
          <span className={S.count}>
            {applications.length} {getApplicationCountText(applications.length)}
          </span>
        </div>

        <button className={S.createApplicationBtn} onClick={() => navigate("/send")} type="button">
          Создать новую заявку
        </button>

        {applications.length === 0 ? (
          <div className={S.emptyState}>У вас пока нет заявок</div>
        ) : (
          <div className={S.applicationsList}>
            {applications.map((app) => (
              <div className={S.applicationCard} key={app.id}>
                <div className={S.applicationTitle}>{app.title}</div>

                <div className={S.applicationInfo}>
                  <span>{app.description}</span>
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
                        Скачать фото к заявке
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
                </div>

                <div className={S.applicationStatus}>
                  <span className={`${S.statusText} ${S[app.status]}`}>Статус: {app.status_display}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserApplicationsPage;
