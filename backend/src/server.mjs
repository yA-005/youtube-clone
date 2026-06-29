

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.mjs';
import authRoutes from './routes/authRoutes.mjs';
import { auth } from './middleware/auth.mjs';
import videoRoutes from './routes/videoRoutes.mjs';
import commentRoutes from './routes/commentRoutes.mjs';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'YouTube Clone API' });
});

app.get('/api/profile', auth, (req, res) => {
    res.json({ message: 'Protected route accessed', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 