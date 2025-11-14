import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: {type: String , required:true, trim:true, match: [/^[0-9\s+()-]{6,20}$/, 'Invalid phone number format']},
  role: { type: String, default: 'user' }
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', userSchema)
