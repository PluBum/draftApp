# Система управления заявками

## Требования

- Node.js 18+
- Python 3.9+
- PostgreSQL

## Установка и запуск

### Бэкенд (Django)

1. Перейдите в директорию backend:

```bash
cd backend
```

2. Создайте виртуальное окружение Python:

```bash
python3 -m venv venv
source venv/bin/activate  # для macOS/Linux
```

3. Установите зависимости:

```bash
pip install -r requirements.txt
```

5. Примените миграции:

```bash
python manage.py migrate
```

6. Создайте суперпользователя:

```bash
python manage.py createsuperuser
```

7. Запустите сервер разработки:

```bash
python manage.py runserver
```

### Фронтенд (React)

1. В новом терминале перейдите в корневую директорию проекта:

```bash
cd ..
```

2. Установите зависимости:

```bash
yarn install
```

3. Запустите сервер разработки:

```bash
yarn dev
```

Приложение будет доступно по адресу http://localhost:5173

## Дополнительные команды

### Бэкенд

- `python manage.py makemigrations` - создать новые миграции
- `python manage.py migrate` - применить миграции
- `python manage.py createsuperuser` - создать администратора

### Фронтенд

- `yarn build` - собрать проект для продакшена
- `yarn lint` - проверить код линтером
- `yarn preview` - предпросмотр собранного проекта
