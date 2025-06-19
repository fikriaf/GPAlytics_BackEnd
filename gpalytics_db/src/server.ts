import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import mahasiswaRoutes from './routes/mahasiswaRoutes';
import mataKuliahRoutes from './routes/matakKuliahRoutes';
import rekomendasiRoutes from './routes/rekomendasiRoutes';
import ipRoutes from './routes/ipRoutes';
import nilaiRoutes from './routes/nilaiRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/mata-kuliah', mataKuliahRoutes);
app.use('/api/rekomendasi', rekomendasiRoutes);
app.use('/api/ip', ipRoutes);
app.use('/api/nilai', nilaiRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
