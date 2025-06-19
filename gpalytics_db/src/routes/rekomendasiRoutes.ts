import express from 'express';
import {
    getAllRekomendasi,
    getRekomendasiById,
    createRekomendasi
} from '../controllers/rekomendasiController';

const router = express.Router();

router.get('/', getAllRekomendasi);
router.get('/:id', getRekomendasiById);
router.post('/', createRekomendasi);

export default router;
