import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('🔹 Testujemy połączenie z Cloudinary...');

cloudinary.api
  .ping()
  .then(() => console.log('✅ Cloudinary connected!'))
  .catch((err) => console.error('❌ Cloudinary error:', err));

export default cloudinary;

// cloudinary.uploader
//   .upload('https://res.cloudinary.com/demo/image/upload/sample.jpg', {
//     folder: 'test-uploads',
//   })
//   .then((result) =>
//     console.log('✅ Testowy upload powiódł się:', result.secure_url),
//   )
//   .catch((err) => console.error('❌ Błąd uploadu:', err));
