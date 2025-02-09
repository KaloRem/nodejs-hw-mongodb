import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Powiązanie z użytkownikiem
      required: true,
    },
  },
  {
    versionKey: false, // Вимикаємо "__v"
    timestamps: true, // Додаємо поля "createdAt" і "updatedAt"
  },
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
