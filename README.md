# 🏫 Campus Club Event Management System

A full-stack web application to manage campus club events with a structured approval workflow, role-based dashboards, and clean modern UI.

---

## 🚀 Overview

This is an **internal college platform** designed to streamline the process of event creation, approval, and participation.

The system ensures:

* Proper approval workflow
* Club-based access control
* Role-based dashboards
* Clean and minimal UI

---

## 🛠️ Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB (Mongoose)

**Authentication**

* JWT (JSON Web Tokens)

---

## 🎯 Key Features

### 🔁 Event Approval Workflow

1. Student submits event proposal
2. Organizer reviews (club-based)
3. Admin approves and assigns budget & venue
4. Approved events become available for registration

---

### 👥 Role-Based Access

* **Student**

  * View events
  * Register for events
  * Submit proposals
  * Download certificates

* **Organizer (Club Member)**

  * Review proposals (only for their club)
  * Approve / Reject events
  * Manage participants
  * Generate certificates
  * View reports

* **Admin**

  * Final approval of events
  * Assign budget and venue
  * Manage users and clubs
  * View reports

---

### 🏫 Club-Based System

* Each organizer belongs to a specific club
* Each event belongs to a club
* Organizers can only manage events of their own club

---

### 💳 Payment System

* Simulated payment flow
* No real payment gateway required
* Registration confirmed after payment success

---

### 🎓 Certificate System

* Organizer uploads certificate template
* Certificates generated automatically
* Students can download after registration

---

## 🗄️ Database Schema (MongoDB)

### Users

* name
* email
* password
* role (student / organizer / admin)
* club (for organizers)

### Clubs

* name
* description

### Events

* title
* description
* date
* club
* status (submitted, forwarded_to_admin, approved, rejected)
* budget
* venue
* createdBy

### Registrations

* user
* event
* paymentStatus

### Certificates

* user
* event
* fileUrl

### Reports

* event
* revenue
* cost

---

## 🎨 UI Design

* Inspired by modern platforms like eventclub.co.in
* Clean, minimal layout
* White + blue color theme (#2563eb)
* Card-based design
* Fully responsive

---

## 📁 Project Structure

### Frontend

```
src/
 ├── components/
 ├── pages/
 ├── routes/
 └── services/
```

### Backend

```
backend/
 ├── controllers/
 ├── models/
 ├── routes/
 └── middleware/
```

---

## 🔐 Security

* JWT Authentication
* Role-based authorization
* Protected routes
* Secure API handling

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/campus-club-system.git
cd campus-club-system
```

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
