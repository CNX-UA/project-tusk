# Project Tusk
Task manager
Monorepo: Rails API (Backend) + Rails/Vite (Frontend)
Stack: Rails 8, PostgreSQL (Backend) + React, MaterialUI, Axios, React Router Dom (Frontend)
## Requirements
Node.js (v18+)
Ruby (v3.4+)
PostgreSQL (v16+)
## How to launch
### 1. Backend (API)
1. Open terminal in "apps/api":
1) bash
2) cd apps/api
3) bundle install
2. Setting up the API
1) Fill out .env (using .env.example)
2) rails db:create
3) rails db:migrate
4) rails db:seed
3. Launch server
1) rails s

API will be available at http://localhost:3000

### 2. Frontend
1. Open new terminal in apps/web:
1) cd apps/web
2) npm install

2. Launch:
1) npm run dev

Frontend will be available at http://localhost:5173

### 3. Testing
Health Check: you can check if API gives user data here - GET http://localhost:3000/api/v1/users

Frontend UI: on main page http://localhost:5173 it should display user list (admin), from DB
