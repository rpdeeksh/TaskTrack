# 📝 TaskTrack – Self Task Management Dashboard

A responsive and intuitive task management dashboard built using the **MERN Stack** (MongoDB, Express, React, Node.js).  
Track tasks, set priorities, monitor progress, and visualize completion rate.

---

## 🚀 Features

- Add, edit, delete, and drag-drop tasks across columns
- Filter by subject, priority, and keyword
- Visual progress indicators and completion stats
- Fully integrated with **MongoDB Atlas** for data persistence
- Clean UI with responsive design

---

## 📦 Tech Stack

- **Frontend**: React (with Hooks), CSS, FontAwesome
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas (via Mongoose)
- **Deployment**: Localhost (development-ready)

---

## 📁 Folder Structure

```
tasktrack/
├── client/          # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/         # Express backend
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── .env         # MongoDB connection string here
│   └── server.js
└── README.md
```

---

## 🧠 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a **free cluster**
3. Create a database user with password
4. Whitelist your IP (`0.0.0.0/0` for development)
5. Click **Connect → Connect your application**
6. Copy the **connection string**, e.g.:

```
mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/tasktrack?retryWrites=true&w=majority
```

7. Paste it in `backend/.env` like this:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/tasktrack?retryWrites=true&w=majority
```

---

## 🛠 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/rpdeeksh/TaskTrack.git
cd tasktrack
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Add your MongoDB URI

Create `backend/.env` and paste your connection string:
```
MONGO_URI=mongodb+srv://...
```

### 5. Start both servers

In two terminals:

```bash
# Terminal 1 – Backend
cd backend
node server.js
```

```bash
# Terminal 2 – Frontend
cd client
npm start
```

Your app should be live at `http://localhost:3000`

---

## 🌐 Deployment Notes

- Add environment variables carefully in production
- Replace `localhost` with your deployed backend API URL if needed
- Tools to consider:
  - **Render / Railway** for backend
  - **Vercel / Netlify** for frontend

---

## 👨‍💻 Author

Developed by **Saanvi R Prabhu**  
📧 [saanvirprabhu@gmail.com](mailto:saanvirprabhu@gmail.com)  
🔗 [LinkedIn Profile](https://www.linkedin.com/in/saanvi-r-prabhu-78b74328b/)

---

## 📄 License

This project is open-source and free to use. ✨
