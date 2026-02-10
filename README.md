# Project Tusk

**Project tusk** is a project management app designed to help teams organize work, similar to Jira or Asana. It handles everything from team creation and nested project structures to task tracking and file attachments.

## Key Features

* **Secure Authentication:** We use a hybrid security model. Short-lived tokens are sent in headers for API access, while long-lived "refresh tokens" are stored securely in your browser (HttpOnly Cookies) to keep you logged in safely.
* **Deep Nesting:** Projects are flexible. A project can act as a **Folder** (containing other sub-projects) or a **Board** (containing tasks).
* **Team Roles:** You can assign users as **Managers** (full control) or **Members** (limited access) within a team.
* **Universal Attachments:** You can attach files to Projects, Tasks, or even specific Comments using a single, unified system.

## 🛠 Tech Stack

* **Framework:** Ruby on Rails 7/8 (API Mode)
* **Database:** PostgreSQL
* **Security:** Devise + JWT + Pundit Policies
* **Formatting:** Blueprinter (for JSON responses)

## How to Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <repository-name> # or by default PROJECT-TUSK
cd apps/api
bundle install
```

### 2. Configure Environment
Create a .env file in apps/api folder. You'll need these keys:

```bash 
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=tusk_development
POSTGRES_HOST=localhost

# Security (Generate using `rails secret`)
DEVISE_JWT_SECRET_KEY=...

# This must be the URL of your Frontend, not this API, 
# it's used to allow CORS and redirect users after OAuth login
DOMAIN_URL=

# OAuth (Optional - for Google/GitHub Login)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### 3. Setup Database

```bash
rails db:create
rails db:migrate
rails db:seed
```

### For Deployment

1. Go to your Hosting Dashboard (Render, Koyeb, Fly.io, etc.).
2. Find the section named "Environment Variables" or "Config Vars".

**Add the following variables one by one:**

* `DATABASE_URL`
    * Value: `postgres://user:password@hostname.com/dbname`
    * *(Copy this from your cloud database provider)*
* `SECRET_KEY_BASE`
    * Value: *(Run `rails secret` locally and paste the result)*
* `DEVISE_JWT_SECRET_KEY`
    * Value: *(Run `rails secret` again and paste the result)*
* `DOMAIN_URL`
    * Value: `https://your-app-name.onrender.com` *(This must be the URL of your Frontend, not this API, 
    it's used to allow CORS and redirect users after OAuth login)*
* `RAILS_ENV`
    * Value: `production`
* `RAILS_LOG_TO_STDOUT`
    * Value: `true`
* `GOOGLE_CLIENT_ID` / `GITHUB_CLIENT_ID`
    * Value: *(New Prod IDs)*

# Authentication Guide (For Frontend)

**Logging In:** When you send a login request, the API returns an Access Token in the JSON body. Keep this in your application state (don't save it to LocalStorage).

**The Cookie:** The API automatically sets a secure, invisible cookie (refresh_token) in your browser. You don't need to handle this manually.

**Making Requests:** Add this header to every API call: Authorization: Bearer <your_access_token>

**Handling Expiration:** If an API call fails with a 401 error, it means your Access Token expired. Send a POST request to /refresh (with credentials enabled). The server will check your cookie and give you a fresh token.