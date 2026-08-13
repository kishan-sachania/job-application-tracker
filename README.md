# 💼 Job Application Tracker

A full-stack **MERN** (MongoDB, Express, React 19, Node.js) job application tracking and management web application built with **TypeScript** and **TailwindCSS**.

Track your job applications, monitor response rates, manage follow-up deadlines, and analyze recruitment metrics with a modern UI.

---

## 🌐 Live Demo & Deployment

- 🚀 **Frontend Live App**: [https://job-application-tracker-sigma-three-39.vercel.app](https://job-application-tracker-sigma-three-39.vercel.app)
- ⚙️ **Backend API Service**: [https://job-application-tracker-8y1l.onrender.com/api](https://job-application-tracker-8y1l.onrender.com/api)

---

## 📖 Project Overview

The **Job Application Tracker** is designed to streamline job hunting by providing job seekers with a centralized dashboard to log, manage, and analyze their job applications.

### Key Capabilities & Architecture
- **Authentication**: JWT authentication using access tokens and refresh tokens stored safely in `localStorage`. Includes guest/protected route guards.
- **Job Application CRUD**: Create, read, update, and delete job applications with fields for company, role, status (`Applied`, `Screening`, `Interview`, `Offer`, `Closed`), location type (`remote`, `onsite`, `hybrid`), applied date, follow-up date, salary expectation, and notes.
- **Analytics & Dashboard**: Real-time stats calculation including total applications count, status breakdown, response rate percentages, and overdue follow-up indicators.
- **Filtering & Search**: Server-supported filtering by status, search by company/role, sorting by date, and pagination.
- **Theme Switcher**: Dark/Light mode theme switching.

---

## 🛠️ Tech Stack (MERN + TypeScript)

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS v4, React Router v7, Lucide Icons, Axios |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | MongoDB & Mongoose 9 |
| **Authentication** | JWT (JSON Web Tokens), `crypto` scryptSync password hashing |

---

## ⚙️ Prerequisites & Setup Steps

Before running the application locally, ensure you have the following installed:

1. **Node.js**: `v18.x` or higher (`node -v`)
2. **npm**: `v9.x` or higher (`npm -v`)
3. **MongoDB Database**: Choose either option below:
   - **Option A (MongoDB Atlas - Cloud)**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), create a database user, and obtain your MongoDB URI connection string (`mongodb+srv://<username>:<password>@<cluster>.mongodb.net/job_tracker`).
   - **Option B (Local MongoDB Service)**: Install [MongoDB Community Edition](https://www.mongodb.com/try/download/community) locally and start the service (`mongodb://localhost:27017/job_tracker`).

---

## 💻 Step-by-Step Run Instructions

### Step 1: Clone the Repository
```bash
git clone https://github.com/kishan-sachania/job-application-tracker.git
cd job-application-tracker
```

### Step 2: Install Dependencies
Run the workspace command to install all packages for both server and client:
```bash
npm run install:all
```
*(Alternatively: `cd server && npm install` and `cd ../client && npm install`)*

### Step 3: Configure Environment Variables
Create `.env` files in both `server/` and `client/` directories as described in the section below.

### Step 4: Run the Application Locally

#### Option A: Concurrent Run (Recommended)
Run both backend and frontend simultaneously from the root directory:
```bash
npm run dev
```

#### Option B: Separate Terminal Run
- **Terminal 1 (Backend Server)**:
  ```bash
  npm run server
  ```
  *(Runs backend on http://localhost:3000)*

- **Terminal 2 (Frontend Client)**:
  ```bash
  npm run client
  ```
  *(Runs frontend on http://localhost:5173)*

---

## 🔑 Environment Variables Explanation

### 1. Server Environment Variables (`server/.env`)

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | Port on which Express server listens (defaults to `3000`). | `3000` |
| `MONGO_URI` | **Yes** | Connection string for MongoDB database instance. | `mongodb+srv://user:pass@cluster.mongodb.net/job_tracker` |
| `JWT_ACCESS_SECRET` | **Yes** | Secret key used to sign JWT access tokens (short-lived). | `super_secret_access_key` |
| `JWT_REFRESH_SECRET` | **Yes** | Secret key used to sign JWT refresh tokens (long-lived). | `super_secret_refresh_key` |
| `CLIENT_URL` | Optional | Allowed origin URL for CORS policy configuration. | `http://localhost:5173` |

### 2. Client Environment Variables (`client/.env`)

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | **Yes** | Base API URL pointing to Express backend service. | `http://localhost:3000/api` |

---

## ⚠️ Known Limitations & Assumptions

1. **Email Verification**: User registration creates accounts immediately without sending confirmation emails.
2. **Password Recovery**: Forgot Password / Reset Password flow is not currently implemented.
3. **Session Storage**: Tokens are stored in `localStorage` for cross-origin CORS compatibility (e.g. Vercel frontend to Render backend).
4. **Rate Limiting**: API rate limiting (e.g. express-rate-limit) is not enforced on auth endpoints.
5. **Render Cold Start**: Free tier deployment on Render spins down after inactivity; initial request may take ~30 seconds to wake up.

---

## 📁 Repository Directory Structure

```
job-application-tracker/
├── client/                                    # Frontend React application
│   ├── src/
│   │   ├── api/                              # Axios client & API endpoints
│   │   ├── components/                       # UI components (Form, List, Stats, etc.)
│   │   ├── context/                          # Auth & Theme context providers
│   │   ├── hooks/                            # Custom React hooks
│   │   ├── pages/                            # Pages (Login, Register, Dashboard)
│   │   └── types/                            # TypeScript types/interfaces
│   └── package.json
├── server/                                    # Backend Express API service
│   ├── app/
│   │   ├── models/                           # Mongoose models (User, JobApplication)
│   │   └── modules/                          # Auth & JobApplication modules
│   ├── config/                               # Database & env config
│   └── package.json
├── package.json                               # Workspace root configuration
└── README.md                                  # Documentation
```

---

## 📜 License

Distributed under the **ISC License**.
