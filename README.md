# Wiki App

A simple full-stack project for working with articles.

## Project structure

wiki-app  
─ backend/ # Node.js server  
─ frontend/ # React frontend  
─ data/ # Folder for storing articles (.json)  
─ README.md

## Backend

### Installing dependencies:

cd backend  
npm install

### Starting the server

node server.js

### API Endpoints:

#### GET / 
— Проверка сервера

#### GET /articles
 — Получить список всех статей

#### GET /articles/:id 
— Получить статью по id

#### POST /articles
 — Создать новую статью

#### Body: 
{"title": "Title", "content": "Content"}

#### Response: 
JSON with id, title, content, createdAt


## Frontend

### Installing dependencies:

cd frontend
npm install

### Starting the frontend: 

npm run dev 


## Установка проекта

# 1. Клонировать репозиторий

git clone <your-repo-url>
cd backend

# Установка
npm install 

# 2. Создать файл окружения .env

# Проект уже содержит .env.example. Создай рабочий .env командой:

cp .env.example .env

# Открой .env и заполни параметры:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=wiki_db
DB_USER=postgres
DB_PASS=your_password(заменить на свой пароль)

# 3. Создать базу данных

npx sequelize-cli db:create

# 4.Применить миграции

npx sequelize-cli db:migrate

# После этого будут созданы таблицы:

Articles

SequelizeMeta

# Проверить можно в psql:

\dt

# Запуск сервера
npm start

