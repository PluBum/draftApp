import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../../api/applications";
import S from "./SendForm.module.scss";
import { toast } from "react-toastify";

const SendForm = () => {
  const [description, setDescription] = useState("");
  const [room, setRoom] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", `Заявка по аудитории ${room}`);
      formData.append("description", `Аудитория: ${room}\nОписание проблемы: ${description}`);
      if (image) {
        formData.append("image", image);
      }

      await createApplication(formData);

      toast.success("Заявка успешно отправлена!");
      navigate("/my-applications");
    } catch (error) {
      toast.error("Произошла ошибка при отправке заявки");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={S.sendFormWrap}>
      <div className={S.sendFormContainer}>
        <h1 className={S.title}>Оставить заявку</h1>

        <form onSubmit={handleSubmit} className={S.form}>
          <label className={S.label}>
            Если оборудование неисправно опишите проблему в форме ниже:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={S.textarea}
            />
          </label>

          <label className={S.label}>
            Номер аудитории в которой находится неисправное оборудование:
            <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} required className={S.input} />
          </label>

          <label className={S.label}>
            Приложить изображение (не обязательно)
            <input
              type="file"
              accept="image/*"
              className={S.fileInput}
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>

          <button type="submit" className={S.button} disabled={isLoading}>
            {isLoading ? "Отправка..." : "Отправить"}
          </button>
        </form>
      </div>

      <button className={S.myApplicationsBtn} onClick={() => navigate("/my-applications")} type="button">
        Мои заявки
      </button>
    </div>
  );
};

export default SendForm;
