# Task Tracker — Frontend

A full-featured React frontend for the Task Tracker API. Built with React 18, Vite, Tailwind CSS, and React Router v6.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework + dev server |
| React Router v6 | Client-side routing |
| Axios | API calls with interceptors |
| Tailwind CSS | Styling |
| Context API | Global auth state |
| Jest + React Testing Library | Testing |

---

## Features

### Authentication
- Register with full name, email, password
- Login with JWT token saved to localStorage
- Auto redirect after login
- Auto logout when token expires
- Protected routes (redirect to login if not authenticated)

### User Dashboard
- Shows logged-in user info
- Task summary stats (total, pending, completed)
- Recent tasks preview
- Admin dashboard shows all users + all tasks

### Task Management
- Create, view, edit, delete tasks
- Toggle task status (pending ↔ completed)
- Filter tasks by status (all / pending / completed)
- Normal users see only their own tasks
- Admin sees all tasks from all users

### Admin Panel (`/admin/users`)
- View all registered users with task count
- Delete any user (cascades to their tasks)
- View all tasks across all users in a table
- Protected — only accessible by admin role

### UI / UX
- Clean dark theme with consistent indigo accent color
- Fully responsive — mobile hamburger menu
- Loading states on all API calls
- Empty state messages
- Form validation with per-field error messages
- API error messages displayed inline

### Security
- JWT stored in localStorage
- No API URLs or secrets hardcoded
- All sensitive config via environment variables
- Protected routes block unauthenticated access

---

## Project Structure

```
src/
├── api/
│   ├── axios.js        # Axios instance with JWT interceptor
│   ├── auth.js         # Register, login API calls
│   ├── tasks.js        # Task CRUD API calls
│   └── users.js        # User API calls
├── components/
│   ├── Navbar.jsx      # Responsive navbar with admin link
│   ├── ProtectedRoute.jsx  # Route guard for auth
│   └── TaskCard.jsx    # Reusable task card component
├── context/
│   └── AuthContext.jsx # Global auth state (user, token, login, logout)
├── pages/
│   ├── Login.jsx       # Login page with validation
│   ├── Register.jsx    # Register page with validation
│   ├── Dashboard.jsx   # User + admin dashboard
│   ├── Tasks.jsx       # Task management page
│   └── AdminUsers.jsx  # Admin panel (users + all tasks)
└── tests/
    ├── Login.test.jsx      # Login form tests
    ├── TaskCard.test.jsx   # TaskCard component tests
    ├── setupTests.js       # Jest setup
    └── __mocks__/
        └── fileMock.js     # CSS mock for Jest
```

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- Backend server running on port 5000 (see backend repo)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/task-tracker-frontend.git
cd task-tracker-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
cp .env.example .env
```

`.env` file contents:
```
VITE_API_URL=http://localhost:5000
```

### 4. Start the development server
```bash
npm run dev
```

App runs at: **http://localhost:5173**

---

## Run Tests

```bash
npm test
```

Expected output:
```
PASS  src/tests/TaskCard.test.jsx
PASS  src/tests/Login.test.jsx

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
```

### What is tested
- `Login.test.jsx` — renders form, shows validation errors, calls API with correct data, displays API errors (integration test)
- `TaskCard.test.jsx` — renders title/description, shows status badge, triggers onDelete and onEdit callbacks (component tests)

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard | Logged in |
| `/tasks` | Task Manager | Logged in |
| `/admin/users` | Admin Panel | Admin only |

---

## How to Create an Admin User

1. Start the backend server
2. Run Prisma Studio:
```bash
# In backend folder
npx prisma studio
```
3. Open `http://localhost:5555`
4. Click **User** → find your user → change `role` to `admin` → Save
5. Logout and login again — Admin Panel will appear in the navbar

---

## Sample User Flow

### Normal User
1. Register at `/register`
2. Redirected to `/dashboard` — see your task stats
3. Go to `/tasks` — create, edit, delete your tasks
4. Toggle task status by clicking the circle button
5. Filter tasks by All / Pending / Completed

### Admin User
1. Login with admin account
2. See **Admin Panel** link in navbar
3. Go to `/admin/users` — view all users, delete users
4. Switch to **All Tasks** tab — see every task from every user
5. Dashboard also shows all users and all tasks

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

> Never commit `.env` to GitHub. Only `.env.example` is committed.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run all tests |