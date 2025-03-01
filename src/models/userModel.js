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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.password.startsWith('$2a$')) {
    console.log('⚠️ The password is already hashed - Ill ignore it.');
    return next();
  }

  console.log(
    '🔍 Hashing the password before writing to MongoDB:',
    this.password,
  );
  this.password = await bcrypt.hash(this.password, 10);
  console.log('✅ Hashed password before writing:', this.password);

  next();
});
const User = mongoose.model('User', userSchema);

export default User;
