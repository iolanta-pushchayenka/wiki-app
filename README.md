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
— Checking the server

#### GET /articles
 — Get a list of all articles

#### GET /articles/:id 
— Get an article by id

#### POST /articles
 — Create a new article

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


## Installing the project
# 1.Clone a repository

git clone <your-repo-url>
cd backend

# Installation
npm install 

# 2. Create an environment file .env

# The project already contains .env.example. Create a working .env with the command:

cp .env.example .env

# Open .env and fill in the parameters:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=wiki_db
DB_USER=postgres
DB_PASS=your_password(replace it with your password)

# 3. Create a database

npx sequelize-cli db:create

# 4.Apply migrations

npx sequelize-cli db:migrate

# After that, the tables will be created:

Articles

SequelizeMeta

# You can check it in psql:

\dt

# Starting the server
npm start

