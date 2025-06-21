import express from "express";
import { getDaftarNilaiLengkap, createDataNilai, deleteDataNilai, editDataNilai } from "../controllers/nilaiController";

const router = express.Router();

router.post("/", createDataNilai);
router.delete('/nilai/:id_mahasiswa/:semester/:tipe_nilai/:nilai/:nama_mk', deleteDataNilai);
router.put('/:id_mahasiswa/:semester/:tipe_nilai/:nilai', editDataNilai);
router.get("/all", getDaftarNilaiLengkap);

export default router;
