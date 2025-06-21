
# 🎓 GPAlytics BackEnd

This project serves as the backend API for the **GPAlytics** system. Built using **Node.js**, **Express**, and **MongoDB**, and written in **TypeScript**, it handles all core logic, routing, and data storage for the GPA analytics platform.

---

## 📁 Project Structure

```
GPAlytics_DB/
├── node_modules/          # Installed dependencies
├── src/
│   ├── config/            # Environment and DB config
│   ├── controllers/       # Request handlers
│   ├── models/            # Mongoose schemas/models
│   ├── routes/            # API route definitions
│   └── server.ts          # Server entry point
├── types/                 # Custom TypeScript types
├── .env                   # Environment variables
├── package.json           # Project metadata & scripts
├── package-lock.json      # Dependency lock file
└── tsconfig.json          # TypeScript config
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/fikriaf/GPAlytics_BackEnd.git
cd GPAlytics_BackEnd
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/gpalyticsDB
PORT=5000
```

### 4. Run the Server (Development)
```bash
npm run dev
```

> Ensure `ts-node-dev` is installed and configured for hot-reloading.

---

## 🧪 Available Scripts

| Command         | Description                      |
|----------------|----------------------------------|
| `npm run dev`  | Run in development mode          |
| `npm run build`| Compile TypeScript to JavaScript |
| `npm start`    | Run the compiled production build|

---

## ⚙️ Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **TypeScript**
- **dotenv**
- **ts-node-dev**

---

## 📬 Example API Endpoints

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | `/api/students`       | Retrieve list of students    |
| POST   | `/api/students`       | Add a new student            |
| GET    | `/api/gpa/:id`        | Get GPA by student ID        |
| POST   | `/api/predict`        | Predict student GPA          |

---

## 🧪 Testing (Optional)

If implemented, you can run tests (e.g. using **Jest**) with:

```bash
npm test
```

---

## 👥 Contributors

- [@fikriaf](https://github.com/fikriaf) — Lead Developer

---

## 📄 License

Licensed under the **MIT License**.  
Feel free to use, modify, and contribute to the project!

> The GPAlytics backend powers the core academic prediction engine for the GPAlytics platform, designed for scalability, accuracy, and performance.
