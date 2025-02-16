# 📌 Node.js + MongoDB API

## 📖 Opis projektu

To API do zarządzania kontaktami, napisane w **Node.js** z wykorzystaniem **MongoDB** jako bazy danych. Obsługuje autoryzację JWT, przesyłanie obrazków do Cloudinary oraz operacje CRUD na kontaktach.

---

## 🚀 Jak uruchomić projekt

### 1️⃣ Skopiuj repozytorium

```bash
git clone https://github.com/KaloRem/nodejs-hw-mongodb.git
cd nodejs-hw-mongodb
git checkout hw6-email-and-images
```

### 2️⃣ Zainstaluj zależności

```bash
npm install
```

### 3️⃣ Skonfiguruj plik `.env`

Stwórz plik `.env` w głównym katalogu i uzupełnij go:

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret
```

### 4️⃣ Uruchom serwer

```bash
npm run dev
```

---

## 🛠️ API Endpoints

### 🔑 **Autoryzacja**

#### 🟢 Logowanie użytkownika

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

### 📇 **Kontakty**

#### 🟢 Pobierz listę kontaktów

**GET `/contacts`**

- **Headers:** `{ "Authorization": "Bearer JWT_TOKEN" }`
- **Response (200 OK)** → lista kontaktów użytkownika

#### 🟢 Pobierz kontakt po ID

**GET `/contacts/:contactId`**

#### 🟢 Dodaj kontakt (z obrazkiem)

**POST `/contacts`**

- **Headers:** `{ "Authorization": "Bearer JWT_TOKEN" }`
- **Body (form-data):**
  - `name` (Text)
  - `email` (Text)
  - `phoneNumber` (Text)
  - `contactType` (Text)
  - `photo` (File) → JPG/PNG

#### 🟡 Aktualizuj kontakt

**PATCH `/contacts/:contactId`**

- **Body (form-data, opcjonalne pola):** `name`, `email`, `phoneNumber`, `contactType`, `photo`

#### 🔴 Usuń kontakt

**DELETE `/contacts/:contactId`**

---

## ✅ Technologie

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT (JSON Web Token)**
- **Multer (przesyłanie plików)**
- **Cloudinary (przechowywanie obrazów)**
- **dotenv (zmienne środowiskowe)**

---

## 💡 Autor

**Bogdan Pasławski**  
📧 bogdan.paslawskii@gmail.com
