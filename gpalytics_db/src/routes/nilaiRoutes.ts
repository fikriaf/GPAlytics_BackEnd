import express from "express";
import { getDaftarNilaiLengkap, createDataNilai } from "../controllers/nilaiController";

const router = express.Router();

router.post("/", createDataNilai);
router.get("/all", getDaftarNilaiLengkap);

export default router;
