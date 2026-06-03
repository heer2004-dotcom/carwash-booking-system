# Sparkle Car Wash — Booking System

A full-stack (MERN) web application for booking car wash services online, built for **IFQ636 Assignment 1**. The system provides a **customer panel** (book and manage car washes) and an **admin panel** (manage wash packages and booking statuses), with secure authentication and role-based access.

## Live Demo

**Public URL:** http://52.62.227.183:5001

### Test admin login
Use these credentials to access the admin dashboard:

- **Email:** admin@admin
- **Password:** admin

Customers can self-register from the **Register** page (choose "Customer").

## Features

- User registration and login (JWT authentication)
- Role-based access control (customer / admin)
- **Bookings CRUD** — customers create, view, edit, and cancel their bookings
- **Wash Packages CRUD** — admins create, read, update, and delete packages
- **Booking status management** — admins update status (pending, confirmed, completed, cancelled)
- Separate customer and admin dashboards

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **Deployment:** AWS EC2 (Ubuntu), served via Express + pm2
- **CI/CD:** GitHub Actions (auto-deploy to EC2 on every push to main)

## Project Management (JIRA)

Board: https://heer2004.atlassian.net/jira/software/projects/SCRUM/summary

## UI/UX Design (Figma)

- Prototype 1: https://www.figma.com/proto/oa4W1Il6l5ToboeeJQd48O/Untitled?node-id=4-367
- Prototype 2: https://www.figma.com/proto/oa4W1Il6l5ToboeeJQd48O/Untitled?node-id=4-187

## Repository Structure

    carwash-booking-system/
    ├── backend/        Express API (auth, bookings, packages)
    │   ├── config/     MongoDB connection
    │   ├── controllers/
    │   ├── middleware/ JWT auth + admin guard
    │   ├── models/     User, Booking, Package
    │   └── routes/
    ├── frontend/       React app (pages + components)
    └── .github/workflows/deploy.yml   CI/CD pipeline

## Local Setup

1. Clone the repository:

        git clone https://github.com/heer2004-dotcom/carwash-booking-system.git
        cd carwash-booking-system

2. Create a file backend/.env with:

        MONGO_URI=<your MongoDB Atlas connection string>
        JWT_SECRET=<your secret key>
        PORT=5001

3. Install dependencies and run:

        npm run install-all
        npm run dev

4. Open http://localhost:3000

## Deployment & CI/CD

The app is deployed on an **AWS EC2** instance. In production, Express serves the compiled React build and the API together on port 5001, kept running with **pm2**. A **GitHub Actions** workflow automatically connects to the server over SSH on every push to main, pulls the latest code, rebuilds the frontend, and restarts the app.
