import express from "express";
import { getIPSByMahasiswa } from "../controllers/ipsController";
import { getIPKByMahasiswa } from "../controllers/ipkController";

const router = express.Router();

router.get("/ipk", getIPKByMahasiswa);
router.get("/ips", getIPSByMahasiswa);

export default router;
