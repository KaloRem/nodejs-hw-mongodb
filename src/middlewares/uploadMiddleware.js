import multer from 'multer';

const storage = multer.memoryStorage(); // Przechowujemy plik w pamięci
const upload = multer({ storage });

export default upload;
