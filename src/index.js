import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import contactsRouter from './routes/contacts.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cors from 'cors';
// import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: '*', // Możesz wpisać konkretną domenę np. 'http://localhost:3000'
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serwowanie dokumentacji Swagger UI
const swaggerDocument = YAML.load(
  path.join(process.cwd(), '/docs/openapi.yaml'),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/swagger', express.static(path.join(process.cwd(), 'swagger')));

app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ message: 'Brak tokena autoryzacji!' });
//   }

//   const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Token nieważny!' });

//     req.user = user;
//     next();
//   });
// };

// app.use('/contacts', verifyToken, contactsRouter);

// Obsługa błędów
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal server error' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found!' });
});

// Połączenie z MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));

export default app;
