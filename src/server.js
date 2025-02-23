// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import authRouter from './routes/auth.js';
// import contactsRouter from './routes/contacts.js';
// import './services/cloudinaryService.js';

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log(`📢 ${req.method} ${req.url}`);
//   console.log('🔍 Headers:', req.headers);
//   console.log('📩 Body:', req.body);
//   console.log('🖼 File:', req.file);
//   console.log('📂 Files:', req.files);
//   next();
// });

// app.use('/auth', authRouter);
// app.use('/contacts', contactsRouter);

// app.use((err, req, res, next) => {
//   res
//     .status(err.status || 500)
//     .json({ message: err.message || 'Internal server error' });
// });

// app.use((req, res, next) => {
//   res.status(404).json({ message: 'Not Found!' });
// });

// mongoose
//   .connect(process.env.MONGODB_URL)
//   .then(() => {
//     console.log('Database connected');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error('Database connection error:', err));

// export default app;
