import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
  },
  { timestamps: true },
);

// Hashowanie hasła przed zapisem
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  console.log('🔍 Haszowanie hasła przed zapisem do MongoDB:', this.password);
  this.password = await bcrypt.hash(this.password, 10);
  console.log('✅ Zahaszowane hasło przed zapisem:', this.password);

  next();
});
const User = mongoose.model('User', userSchema);

export default User;
