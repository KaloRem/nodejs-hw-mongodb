# 📌 Node.js + MongoDB API

## 📚 Project Description

This is a **Node.js** API for managing contacts, using **MongoDB** as the database. It supports JWT authentication, image uploads to Cloudinary, and CRUD operations on contacts.

---

## 🚀 How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/KaloRem/nodejs-hw-mongodb.git
cd nodejs-hw-mongodb
git checkout hw6-email-and-images
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure the `.env` File

Create a `.env` file in the root directory and fill in the necessary credentials:

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret
```

### 4️⃣ Start the Server

```bash
npm run dev
```

---

## 🛠️ API Endpoints

### 🔑 **Authentication**

#### 🟢 User Login

**POST `/auth/login`**

- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "accessToken": "JWT_TOKEN"
  }
  ```

### 👇 **Contacts**

#### 🟢 Get Contact List

**GET `/contacts`**

- **Headers:** `{ "Authorization": "Bearer JWT_TOKEN" }`
- **Response (200 OK)** → User's contact list

#### 🟢 Get Contact by ID

**GET `/contacts/:contactId`**

#### 🟢 Add a Contact (with Image)

**POST `/contacts`**

- **Headers:** `{ "Authorization": "Bearer JWT_TOKEN" }`
- **Body (form-data):**
  - `name` (Text)
  - `email` (Text)
  - `phoneNumber` (Text)
  - `contactType` (Text)
  - `photo` (File) → JPG/PNG

#### 🟡 Update a Contact

**PATCH `/contacts/:contactId`**

- **Body (form-data, optional fields):** `name`, `email`, `phoneNumber`, `contactType`, `photo`

#### 🔴 Delete a Contact

**DELETE `/contacts/:contactId`**

---

## ✅ Technologies Used

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT (JSON Web Token)**
- **Multer (file uploads)**
- **Cloudinary (image storage)**
- **dotenv (environment variables)**
- **Swagger UI (API documentation)**

---

## 📚 API Documentation with Swagger

This project includes an interactive API documentation using **Swagger UI**.

### 🛠️ How to Access Swagger UI

1. Start the server (`npm run dev`).
2. Open your browser and go to:
   ```
   http://localhost:3000/api-docs
   ```

Swagger UI allows you to test API endpoints directly from the browser, view request/response details, and authenticate with JWT tokens.

---

## 💡 Author

**Bogdan Pasławski**  
📧 bogdan.paslawskii@gmail.com
