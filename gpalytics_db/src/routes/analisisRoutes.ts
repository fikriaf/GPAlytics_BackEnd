import express from 'express';
import {
    getAllAnalisis,
    getAnalisisById,
    createAnalisis,
    editAnalisis
} from '../controllers/analisisController';

const router = express.Router();

router.get('/', getAllAnalisis);
router.post('/', createAnalisis);
router.get('/:id', getAnalisisById);
router.put('/:id', editAnalisis);

export default router;
