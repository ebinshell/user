import express from 'express'
import mongoose from 'mongoose'
import User from './models/User.js'
import cors from 'cors'

// dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
    

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vite_app'

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// create user
app.post('/api/users', async (req, res) => {
  try {
    console.log('Request body:', req.body)
    const { name, email, phone ,role } = req.body
    if (!name || !email || !phone) return res.status(400).json({ error: 'name and email and phone is required' })

    const user = new User({ name, email,phone , role })
    const saved = await user.save()
    res.status(201).json(saved)
  } catch (err) {
    console.error(err)
    // handle duplicate email unique index message
    if (err.code === 11000) return res.status(400).json({ error: 'email already exists' })
    res.status(500).json({ error: 'server error' })
  }
})

// list users
app.get('/api/users', async (req, res) => {
  try {
    const all = await User.find()
    // .sort({ createdAt: -1 }).limit(100)
    res.json(all)
  } catch (err) {
    res.status(500).json({ error: 'server error' })
  }
})

// update user (partial)
app.patch('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    const updated = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ error: 'user not found' })
    res.json(updated)
  } catch (err) {
    console.error('Update error:', err)
    res.status(500).json({ error: 'server error' })
  }
})

// delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await User.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'user not found' })
    res.json({ ok: true, deletedId: deleted._id })
  } catch (err) {
    console.error('Delete error:', err)
    res.status(500).json({ error: 'server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
