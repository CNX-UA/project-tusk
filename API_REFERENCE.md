# API Reference

**Base URL:** `http://localhost:3000`
**Prefix:** `/api/v1` (All endpoints, including Auth, use this prefix)

## Authentication

### **Login**
* **Endpoint:** `POST /api/v1/login`
* **Description:** Logs the user in and sets the secure refresh cookie.
* **Payload:**
    ```json
    { "user": { "email": "user@test.com", "password": "password" } }
    ```

### **Signup**
* **Endpoint:** `POST /api/v1/signup`
* **Description:** Registers a new user account.
* **Payload:**
    ```json
    { "user": { "email": "...", "password": "...", "password_confirmation": "..." } }
    ```

### **Refresh Token**
* **Endpoint:** `POST /api/v1/refresh`
* **Description:** Generates a new Access Token.
* **Note:** You must ensure your frontend sends cookies (e.g., `withCredentials: true` in Axios).

### **Logout**
* **Endpoint:** `DELETE /api/v1/logout`
* **Description:** Revokes the current token and deletes the cookie.

---

## Projects

Projects function as either **Folders** (containing sub-projects) or **Boards** (containing tasks).

### **List Projects**
* **Endpoint:** `GET /api/v1/projects`
* **Filters (Query Params):**
    * `team_id=1` (Get projects for a specific team)
    * `status=active` (Filter by status)
    * `root=true` (Get only top-level folders)

### **Get Project Details**
* **Endpoint:** `GET /api/v1/projects/:id`
* **Response:** Returns the project data. If it's a folder, it includes `subprojects`. If it's a board, it includes `tasks`.

### **Create Project**
* **Endpoint:** `POST /api/v1/projects`
* **Payload:**
    ```json
    {
      "project": {
        "title": "New Project",
        "team_id": 1,
        "parent_id": null, // Use ID to make it a sub-project
        "description": "Optional description"
      }
    }
    ```

### **Update / Delete**
* **Update:** `PUT /api/v1/projects/:id`
* **Delete:** `DELETE /api/v1/projects/:id`

---

## Tasks

### **List Tasks**
* **Endpoint:** `GET /api/v1/projects/:id/tasks`
* **Filters:** `status=0` (Todo), `assignee_id=5`

### **Create Task**
* **Endpoint:** `POST /api/v1/projects/:id/tasks`
* **Payload:**
    * *Note: 0: Priority levels are 0 (Low), 1 (Medium), 2 (High), 3 (Urgent)*
    ```json
    {
      "task": {
        "title": "Fix critical bug",
        "priority": 2,
        "assignee_id": 2,
        "deadline": "2026-12-31"
      }
    }
    ```

### **Get Task Details**
* **Endpoint:** `GET /api/v1/tasks/:id`
* **Response:** Includes the task details, assigned user, creator, comments, and attachments.

---

## Teams

### **Manage Teams**
* **List My Teams:** `GET /api/v1/teams`
* **Create Team:** `POST /api/v1/teams`
    * *Payload:* `{ "team": { "name": "Dev Squad", "department_type": "it" } }`

### **Manage Members**
* **View Members:** `GET /api/v1/teams/:id/memberships`
* **Add Member:** `POST /api/v1/teams/:id/memberships`
    * *Payload:* `{ "email": "colleague@test.com", "role": "member" }`
* **Remove Member:** `DELETE /api/v1/teams/:id/memberships/:membership_id`

---

## Attachments & Comments

### **Comments**
* **Add Comment:** `POST /api/v1/tasks/:id/comments`
    * *Payload:* `{ "comment": { "content": "Here is the update." } }`
* **Delete Comment:** `DELETE /api/v1/comments/:id`

### **Attachments (Files)**
You can upload files to three different places using a similar request format.

* **To a Project:** `POST /api/v1/projects/:id/attachments`
* **To a Task:** `POST /api/v1/tasks/:id/attachments`
* **To a Comment:** `POST /api/v1/comments/:id/attachments`

**Payload for Attachment:**
```json
{
  "attachment": {
    "file_url": "https://firebase-storage-url...",
    "file_type": "pdf",
    "file_name": "specs.pdf"
  }
}