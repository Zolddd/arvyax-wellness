# 🌿 Arvyax Wellness Platform

A **full-stack wellness platform** where users can register, log in, create and manage wellness sessions (yoga, meditation, etc.).  
Users can **save drafts**, **auto-save while typing**, **publish sessions**, and manage them from their dashboard.  
The platform is built using **React.js** for the frontend, **Node.js + Express** for the backend, and **MongoDB Atlas** for data storage.  
Deployed with **Render** (backend) and **Netlify** (frontend).

---

## 🚀 Live Links
- **Frontend (Netlify):** [https://arvyaxx.netlify.app/](https://arvyaxx.netlify.app/)
- **Backend API (Render):** [https://arvyax-wellness-tj5d.onrender.com](https://arvyax-wellness-tj5d.onrender.com)
- **GitHub Repository:** [https://github.com/Zolddd/arvyax-wellness](https://github.com/Zolddd/arvyax-wellness)

---

## 📌 Functionalities
- 🔐 **User Authentication** – Secure login & registration using JWT.
- 📝 **Session Creation** – Users can create wellness sessions with a title, tags, and JSON file link.
- 💾 **Auto-Save Draft** – Automatically updates an existing draft when the user types.
- 🚀 **Publish Session** – Convert a draft into a published session visible to the public.
- 🗑 **Delete Sessions** – Remove drafts or published sessions from the account.
- 🔍 **View Single Session** – View the details of a specific session.
- 📜 **List Public Sessions** – Browse all published sessions without logging in.
- 📱 **Responsive Design** – Works seamlessly on mobile, tablet, and desktop.
- 🎯 **User-Friendly UI** – Minimal, clean, and easy-to-navigate interface.

---

## 📄 Pages
| Page | Path | Description |
|------|------|-------------|
| **Dashboard** | `/` | Displays all public sessions. Acts as the landing page for visitors. |
| **Login** | `/login` | Allows users to log in using their registered email and password. |
| **Register** | `/register` | Allows new users to create an account with success/error feedback. |
| **My Sessions** | `/my-sessions` | Displays both draft and published sessions of the logged-in user. |
| **Session Editor** | `/session-editor` | Create or edit a session with live auto-save and publish options. |

---

## 🛠 API Endpoints

### **1. User Registration**
**POST** `/auth/register` – Create a new account.  
**Request Body:**
```json
{
  "email": "testuser@example.com",
  "password": "Test1234"
}

Response:

{ "msg": "User registered" }

2. User Login
POST /auth/login – Authenticate and receive a JWT token.
Request Body:

{
  "email": "testuser@example.com",
  "password": "Test1234"
}

Response:

{ "token": "eyJhbGciOi..." }

3. Get All Public Sessions
GET /sessions – No authentication required.

4. Get My Sessions
GET /sessions/my-sessions – Requires:

Authorization: Bearer <token>

5. Save Draft Session
POST /sessions/my-sessions/save-draft
Request Body:

{
  "title": "My First Yoga Session",
  "tags": "yoga,relax",
  "json_file_url": "https://example.com/session1.json"
}

6. Publish a Session
POST /sessions/my-sessions/publish
Request Body:

{
  "id": "<draft-session-id>"
}

7. View Single Session
GET /sessions/my-sessions/:id

8. Delete Session
DELETE /sessions/my-sessions/:id

📂 Project Structure

arvyax-wellness/
│
├── backend/                # Backend (Node.js + Express)
│   ├── models/              # Mongoose Schemas
│   ├── routes/              # API Endpoints
│   ├── middleware/          # Auth Middleware
│   ├── server.js            # Backend Entry
│   └── .env                  # Environment Variables
│
├── frontend/               # Frontend (React.js)
│   ├── src/pages/           # Pages (Dashboard, Login, Register, MySessions, SessionEditor)
│   ├── src/components/      # Navbar, Footer, etc.
│   ├── .env                  # REACT_APP_API_URL
│   └── netlify.toml          # Netlify Redirect Rules

⚙️ Installation & Setup
Backend Setup

cd backend
npm install
npm start

Frontend Setup

cd frontend
npm install
npm start

🌍 Deployment
Backend (Render)
1. Push code to GitHub.

2. Create a new Web Service on Render.

3. Link GitHub repo and select the backend folder.

4. Add .env variables in Render settings.

5. Deploy.

Frontend (Netlify)
1. Push code to GitHub.

2. Create a new site on Netlify.

3. Link GitHub repo and select frontend folder.

4. Add .env variable (REACT_APP_API_URL with Render backend URL).

5. Deploy.

📜 License
MIT License © 2025 Arvyax Wellness
