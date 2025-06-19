import express from 'express';
import {
    getAllMataKuliah,
    getMataKuliahByCodeMK,
    createMataKuliah,
    updateMataKuliah,
    deleteMataKuliah
} from '../controllers/mataKuliahController';

const router = express.Router();

router.get('/', getAllMataKuliah);
router.get('/:code_mk', getMataKuliahByCodeMK);
router.post('/', createMataKuliah);
router.put('/:code_mk', updateMataKuliah);
router.delete('/:code_mk', deleteMataKuliah);

export default router;
