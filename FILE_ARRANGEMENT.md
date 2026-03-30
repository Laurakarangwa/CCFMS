# CCFMS Rwanda — How Files Are Arranged

This document explains where every part of the project lives so you can find and present code easily.

---

## Top-level layout

```
CCFMS/
├── backend/          ← Node.js + Express + PostgreSQL API
├── frontend/         ← React app (citizen portal + dashboards)
├── FILE_ARRANGEMENT.md   ← This file
└── README.md         ← How to run the project
```

---

## Backend (`backend/`)

| Folder/File | Purpose |
|-------------|--------|
| **package.json** | Dependencies (express, pg, jwt, bcrypt, etc.) and run scripts |
| **.env.example** | Template for DB URL and JWT secret (copy to `.env`) |
| **server.js** | Entry point: starts Express, connects DB, mounts routes |
| **config/db.js** | PostgreSQL connection pool |
| **models/** | One file per main table (User, Complaint, Feedback, etc.) |
| **routes/** | API route definitions (auth, complaints, users, etc.) |
| **middleware/** | Auth (JWT), role check, audit logging |
| **controllers/** | Business logic for each route group |
| **utils/** | Helpers (e.g. duplicate check, notifications) |

### Backend files in order

```
backend/
├── package.json
├── .env.example
├── server.js
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Complaint.js
│   ├── Feedback.js
│   ├── AuditLog.js
│   └── Department.js
├── routes/
│   ├── auth.js
│   ├── complaints.js
│   ├── feedback.js
│   ├── users.js
│   ├── departments.js
│   └── audit.js
├── controllers/
│   ├── authController.js
│   ├── complaintController.js
│   ├── feedbackController.js
│   ├── userController.js
│   ├── departmentController.js
│   └── auditController.js
├── middleware/
│   ├── auth.js
│   └── audit.js
└── utils/
    ├── duplicateCheck.js
    └── notifications.js
```

---

## Frontend (`frontend/`)

| Folder/File | Purpose |
|-------------|--------|
| **package.json** | Dependencies (react, react-router-dom, axios, etc.) |
| **index.html** | Single HTML shell (at frontend root; Vite entry) |
| **src/main.jsx** | Renders `<App />` into `#root` |
| **src/App.js** | Router and role-based layout (which dashboard to show) |
| **src/context/AuthContext.js** | Current user and login/logout (shared across pages) |
| **src/services/api.js** | Axios instance and API base URL |
| **src/components/** | Reusable UI (Navbar, Sidebar, forms, cards) |
| **src/pages/** | One folder per role; each role has its main screens |

### Frontend files by role

```
frontend/
├── package.json
├── index.html
└── src/
    ├── index.js
    ├── App.js
    ├── context/
    │   └── AuthContext.js
    ├── services/
    │   └── api.js
    ├── components/
    │   ├── Layout.js
    │   ├── Navbar.js
    │   ├── Sidebar.js
    │   ├── ComplaintForm.js
    │   ├── ComplaintCard.js
    │   ├── StatusBadge.js
    │   └── PrivateRoute.js
    └── pages/
        ├── citizen/        ← Citizen portal
        │   ├── Dashboard.js
        │   ├── SubmitComplaint.js
        │   ├── MyComplaints.js
        │   └── Feedback.js
        ├── admin/          ← Admin console
        │   ├── Dashboard.js
        │   ├── Complaints.js
        │   ├── Users.js
        │   ├── Departments.js
        │   └── AuditLog.js
        ├── officer/        ← Officer dashboard
        │   └── Dashboard.js
        ├── supervisor/     ← Supervisor dashboard
        │   └── Dashboard.js
        └── agent/          ← Agent (front desk) dashboard
            └── Dashboard.js
```

---

## Quick reference: “Where do I show the facilitator?”

| Topic | Where to open |
|-------|----------------|
| API entry & DB connection | `backend/server.js`, `backend/config/db.js` |
| User roles & auth | `backend/middleware/auth.js`, `backend/models/User.js` |
| Complaints (create, assign, status) | `backend/controllers/complaintController.js`, `backend/routes/complaints.js` |
| Audit log (NFR 5) | `backend/middleware/audit.js`, `backend/models/AuditLog.js` |
| Citizen: submit & track | `frontend/src/pages/citizen/SubmitComplaint.js`, `MyComplaints.js` |
| Admin: assign & manage | `frontend/src/pages/admin/Complaints.js` |
| Officer: assigned cases | `frontend/src/pages/officer/Dashboard.js` |
| Role-based routing | `frontend/src/App.js`, `frontend/src/components/PrivateRoute.js` |

---

## Summary

- **Backend**: `backend/` — all server code; start with `server.js` and follow routes → controllers → models.
- **Frontend**: `frontend/` — Vite + React; entry is `index.html` → `src/main.jsx` → `App.jsx`; then `src/pages/<role>/` for each user type.
- **Config**: `backend/.env` (from `.env.example`) for database and JWT; no secrets in the repo.
- **Database**: Run `backend/scripts/init-db.sql` once; then `node backend/scripts/seed-admin.js` to create the first admin user.
