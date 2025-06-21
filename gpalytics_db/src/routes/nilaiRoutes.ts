import express from "express";
import { getDaftarNilaiLengkap, createDataNilai, deleteDataNilai } from "../controllers/nilaiController";

const router = express.Router();

router.post("/", createDataNilai);
router.delete("/:id_mahasiswa/:id_mk/:semester/:tipe_nilai/:nilai", deleteDataNilai)
router.get("/all", getDaftarNilaiLengkap);

export default router;
