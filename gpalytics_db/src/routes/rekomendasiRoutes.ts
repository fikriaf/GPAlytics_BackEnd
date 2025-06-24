import express from 'express';
import {
    getAllRekomendasi,
    getRekomendasiById,
    createRekomendasi,
    editRekomendasi
} from '../controllers/rekomendasiController';

const router = express.Router();

router.get('/', getAllRekomendasi);
router.post('/', createRekomendasi);
router.get('/:id', getRekomendasiById);
router.put('/:id', editRekomendasi);

export default router;
