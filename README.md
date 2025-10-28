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



