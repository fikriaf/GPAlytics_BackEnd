import express from 'express';
import {
    getAllMahasiswa,
    getMahasiswaByEmail,
    createMahasiswa,
    updateMahasiswa,
    deleteMahasiswa
} from '../controllers/mahasiswaController';


const router = express.Router();

router.get('/', getAllMahasiswa);
router.get('/:email', getMahasiswaByEmail)
router.post('/', createMahasiswa);
router.put('/:email', updateMahasiswa);
router.delete('/:email', deleteMahasiswa);

export default router;
