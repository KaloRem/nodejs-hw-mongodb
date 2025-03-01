import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  preservePath: true,
});

export const testUploadMiddleware = (req, res, next) => {
  console.log('🚀 TEST: Does Multer work?');
  console.log('📩 Body:', req.body);
  console.log('🖼 File:', req.file);
  console.log('📂 Files:', req.files);
  next();
};

export default upload;
