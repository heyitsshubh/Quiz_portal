# Quiz Portal

A full-featured quiz management portal built with **React**, **Vite**, **Tailwind CSS**, and **Node.js/Express** backend.  
Supports admin and user roles, quiz creation, timed quiz taking, result dashboards, and more.

## Features

- User Signup & Login (Admin & Participant)
- Quiz Creation & Management (Admin)
- Add/Edit/Delete Questions (Admin)
- Timed Quiz Participation (User)
- Tab Switch Detection & Auto-Submit
- Live Timer & Navigation
- Result Dashboard & Analytics
- React Toast Notifications
- Zustand State Management
- Responsive UI with Tailwind CSS

## Technologies Used

### Frontend

- React (Vite)
- Tailwind CSS
- Zustand (state management)
- React Toastify (notifications)
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- Multer (for file uploads)
- CORS


## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Error-404ai/quiz-portal.git
cd quiz-portal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

---

## Folder Structure

```
src/
  ├── Components/
  │     ├── Auth/         # Signup, Login, Forgot
  │     ├── Admin/        # Admin dashboard, quiz management
  │     ├── User/         # Quiz taking, results, terms
  │     ├── store/        # Zustand state management
  │     └── assets/       # Images and static files
  ├── utils/              # Axios instance and helpers
  └── App.jsx             # Main app entry
```

---

## Screenshots

Below are some screenshots of the portal UI:

### Signup Page

![Signup Screenshot](./src/assets/signup_screenshot.png)

### Quiz Taking Page

![Quiz Screenshot](./src/assets/quiz_screenshot.png)


## License

MIT

---

## Credits

Developed by **Shubh Gupta** and **Tanisha Bhatt**  
GitHub Repo(Backend):[Error404-ai](https://github.com/Error404-ai/Quiz-Portal)
     