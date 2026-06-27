# 🏫 Campus Club Event Management System

A full-stack college event management platform with role-based dashboards, an approval workflow, event registration, email notifications, and certificate management.

---

## 🚀 Overview

This project helps students, organizers, and admins manage campus club events in a structured workflow:

* Students submit event proposals, browse approved events, and register
* Organizers review proposals for their club, approve or reject them, and manage participants
* Admins perform final event approval, set budget/venue, and manage users/clubs

---

## 🛠️ Tech Stack

**Frontend**

* React 19 + Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Hot Toast

**Backend**

* Node.js
* Express.js
* MongoDB with Mongoose
* JSON Web Tokens (JWT)
* Nodemailer for email

---

## 🎯 Key Features

* Role-based authentication and authorization
* Student event proposal submission
* Club-based organizer approval workflow
* Admin approval for final event publishing
* Event registration and payment simulation
* Email notifications for OTP and approved events
* Certificate upload and download support
* Reports for events and registrations

---

## 📁 Project Structure

### Frontend

```
frontend/
 ├── public/
 ├── src/
 │   ├── assets/
 │   ├── components/
 │   ├── context/
 │   ├── pages/
 │   ├── routes/
 │   └── services/
 ├── package.json
 └── vite.config.js
```

### Backend

```
backend/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── services/
 ├── utils/
 ├── server.js
 ├── seed.js
 └── package.json
```

---

## 🔧 Setup Instructions

### 1️⃣ Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with values similar to:

```env
PORT=5002
MONGO_URI=mongodb://localhost:27017/campusV2
JWT_SECRET=your_jwt_secret
NODE_ENV=development
EMAIL_SERVICE=Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
FRONTEND_URL=http://localhost:5173
EMAIL_ALLOW_SELF_SIGNED=true
```

> If you use Gmail, create an app password and use that in `EMAIL_PASS`.

Seed demo data:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

---

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the browser at the Vite URL shown in the terminal (usually `http://localhost:5173`).

---

## 🧪 Demo Accounts

Use these seeded accounts after running `npm run seed` in `backend`:

* Admin: `admin@kitsw.ac.in` / `admin123`
* Tech Organizer: `ravi@kitsw.ac.in` / `organizer123`
* Sports Organizer: `priya@kitsw.ac.in` / `organizer123`
* Cultural Organizer: `anita@kitsw.ac.in` / `organizer123`
* Student 1: `arjun@kitsw.ac.in` / `student123`
* Student 2: `sneha@kitsw.ac.in` / `student123`
* Student 3: `rahul@kitsw.ac.in` / `student123`

---

## 📌 Notes

* Admin and organizers are seeded as verified users.
* Students may need email OTP verification depending on registration flow.
* Approved event notifications are sent to verified users with valid email addresses.

---

## 🧾 Backend Scripts

From `backend`:

* `npm run dev` — start the dev server with nodemon
* `npm run start` — start the server normally
* `npm run seed` — seed demo data into MongoDB

---

## 🚀 Frontend Scripts

From `frontend`:

* `npm run dev` — start Vite development server
* `npm run build` — build production assets
* `npm run preview` — preview the production build
* `npm run lint` — run ESLint

---

## 📚 Useful Links

* Backend API prefix: `/api`
* Auth routes: `/api/auth`
* Event routes: `/api/events`
* Registration routes: `/api/registrations`
* Club routes: `/api/clubs`
* Report routes: `/api/reports`

---

## ✅ License

This project is for demo and internal use.

---

### 2️⃣ Setup Backend

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Setup Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🧪 Sample Roles (for testing)

* Student → can register & propose events
* Organizer → approves events for their club
* Admin → final approval & management

---

## 🚀 Future Enhancements

* Real payment gateway integration
* Email notifications
* Event chat system
* Advanced analytics dashboard

---

## 📌 Important Notes

* This is an internal campus system
* Workflow logic is strictly enforced
* UI is designed to be clean and professional
* Built with scalability in mind

---

## 👨‍💻 Author

Abhilash

---

## ⭐ If you like this project

Give it a star on GitHub ⭐
