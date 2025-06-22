import express from "express";
import { getDaftarNilaiLengkap, createDataNilai, deleteDataNilai, editDataNilai } from "../controllers/nilaiController";

const router = express.Router();

router.post("/", createDataNilai);
router.delete('/', deleteDataNilai);
router.put('/', editDataNilai);
router.get("/all", getDaftarNilaiLengkap);

export default router;
