# 💼 Job Application Tracker

A full-stack job application tracking and management web application built with **React 19**, **TypeScript**, **TailwindCSS**, **Node.js**, **Express**, and **MongoDB**. 

Track your job applications, monitor response rates, manage follow-up deadlines, and analyze recruitment metrics with a modern UI.

---

## 🌐 Live Demo & Deployment

- 🚀 **Frontend Live App**: [https://job-application-tracker-sigma-three-39.vercel.app](https://job-application-tracker-sigma-three-39.vercel.app)
- ⚙️ **Backend API Service**: [https://job-application-tracker-8y1l.onrender.com/api](https://job-application-tracker-8y1l.onrender.com/api)

---

## ✨ Features

- 🔐 **Authentication System**: User registration and login using JWT access & refresh tokens stored safely in `localStorage` with password hashing (`scrypt`).
- 📊 **Dashboard & Metrics**: Overview analytics featuring total applications, status breakdown, response rate calculations, and overdue follow-up alerts.
- 📋 **Job Application Management (CRUD)**:
  - Create, view, update, and delete job applications.
  - Track Company, Role, Status (`Applied`, `Screening`, `Interview`, `Offer`, `Closed`), Location (`remote`, `onsite`, `hybrid`), Applied Date, Next Follow-up Date, Salary Expectations, and Notes.
- 🔍 **Search & Filtering**: Search applications by company or role, filter by application status, sort by date/salary, and navigate with server-side pagination.
- 🌓 **Theme Support**: Seamless Dark Mode and Light Mode switching powered by React context.
- 📬 **Postman Collection Included**: Complete Postman v2.1 collection with automated scripts for API testing.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS v4
- **Routing**: React Router v7
- **HTTP Client**: Axios with automated 401 refresh token interceptors
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express 5
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose 9
- **Authentication**: JWT (JSON Web Tokens) with crypto password hashing

---

## 📁 Repository Structure

```
job-application-tracker/
├── client/                                    # Frontend React application
│   ├── src/
│   │   ├── api/                              # Axios instance & API client modules
│   │   ├── components/                       # UI components (Form, List, Stats, etc.)
│   │   ├── context/                          # Auth & Theme context providers
│   │   ├── hooks/                            # Custom React hooks (useApplications)
│   │   ├── pages/                            # Page components (Login, Register, Dashboard)
│   │   └── types/                            # TypeScript interfaces
│   └── package.json
├── server/                                    # Backend Express API service
│   ├── app/
│   │   ├── models/                           # Mongoose models (User, JobApplication)
│   │   └── modules/                          # Auth & JobApplication modules (controllers, routes, services)
│   ├── config/                               # MongoDB & environment config
│   └── package.json
├── Job_Application_Tracker.postman_collection.json  # Postman API Collection
├── package.json                               # Workspace root configuration
└── README.md                                  # Project documentation
```

---

## 🚀 Local Setup & Installation

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB Atlas** database connection string (or local MongoDB instance)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/kishan-sachania/job-application-tracker.git
cd job-application-tracker
```

---

### Step 2: Install Dependencies

Install root workspace dependencies and client/server packages:

```bash
npm run install:all
```

*Or install individually:*

```bash
# Install root
npm install

# Install server
cd server && npm install && cd ..

# Install client
cd client && npm install && cd ..
```

---

### Step 3: Configure Environment Variables

#### 1. Server Environment Configuration
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/job_tracker?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
CLIENT_URL=http://localhost:5173
```

#### 2. Client Environment Configuration
Create a `.env` file inside the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Step 4: Run the Development Server

Start both the backend server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🧪 Running API Tests via Postman

1. Open **Postman**.
2. Click **Import** and select `Job_Application_Tracker.postman_collection.json` located in the root directory.
3. Run **`1. Register User`** or **`2. Login User`**. The collection test script automatically saves `accessToken`, `refreshToken`, `userId`, and `applicationId` into collection variables for all subsequent requests.

---

## 📜 License

This project is licensed under the **ISC License**.
