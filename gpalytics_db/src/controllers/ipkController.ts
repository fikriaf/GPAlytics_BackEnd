import { Request, Response } from "express";
import DataNilai from "../models/DataNilai";
import mongoose from "mongoose";

// Konversi nilai ke bobot mutu
function getBobotMutu(nilai: number): number {
    if (nilai >= 90) return 4.0;
    if (nilai >= 80) return 3.7;
    if (nilai >= 75) return 3.3;
    if (nilai >= 70) return 3.0;
    if (nilai >= 65) return 2.7;
    if (nilai >= 60) return 2.3;
    if (nilai >= 55) return 2.0;
    if (nilai >= 50) return 1.7;
    if (nilai >= 40) return 1.0;
    return 0.0;
}

// Fungsi untuk IPK (semua semester)
export const getIPKByMahasiswa = async (req: Request, res: Response) => {
    const { id_mahasiswa } = req.query;

    if (!id_mahasiswa || typeof id_mahasiswa !== 'string' || !mongoose.Types.ObjectId.isValid(id_mahasiswa)) {
        res.status(400).json({ message: "id_mahasiswa tidak valid atau tidak dikirim" });
        return
    }

    try {
        const nilaiList = await DataNilai.find({ id_mahasiswa }).populate("id_mk");

        const semesterGrouped: Record<number, typeof nilaiList> = {};
        nilaiList.forEach(item => {
            const smt = item.semester || 0;
            if (!semesterGrouped[smt]) semesterGrouped[smt] = [];
            semesterGrouped[smt].push(item);
        });

        const ipkPerSemester: { semester: number; ips: number }[] = [];
        let totalMutu = 0;
        let totalSks = 0;

        for (const semesterStr in semesterGrouped) {
            const nilaiPerMatkul: Record<string, {
                tugas?: number;
                uts?: number;
                uas?: number;
                sks: number;
                penilaian: { tugas: number; uts: number; uas: number };
        }> = {};

        const nilaiSmt = semesterGrouped[Number(semesterStr)];

        for (const item of nilaiSmt) {
            const mk = item.id_mk as any;
            if (!mk || !mk._id) continue;

            const mkId = mk._id.toString();

            if (!nilaiPerMatkul[mkId]) {
                nilaiPerMatkul[mkId] = {
                    sks: mk.sks ?? 0,
                    penilaian: mk.penilaian ?? { tugas: 30, uts: 30, uas: 40 },
                };
            }

            const rawTipe = item.tipe_nilai;
            if (typeof rawTipe === "string") {
                const tipe = rawTipe.toLowerCase();
                if (["tugas", "uts", "uas"].includes(tipe)) {
                    nilaiPerMatkul[mkId][tipe as "tugas" | "uts" | "uas"] = item.nilai ?? 0;
                }
            }
        }

        let smtMutu = 0;
        let smtSks = 0;

        for (const mkId in nilaiPerMatkul) {
            const matkul = nilaiPerMatkul[mkId];
            const { tugas = 0, uts = 0, uas = 0, sks, penilaian } = matkul;

            const nilaiAkhir = (
                (tugas * (penilaian.tugas || 0)) +
                (uts * (penilaian.uts || 0)) +
                (uas * (penilaian.uas || 0))
            ) / 100;

            const mutu = getBobotMutu(nilaiAkhir) * sks;
            smtMutu += mutu;
            smtSks += sks;
        }

        const ips = smtSks === 0 ? 0 : smtMutu / smtSks;
        totalMutu += smtMutu;
        totalSks += smtSks;

        ipkPerSemester.push({
            semester: Number(semesterStr),
            ips: parseFloat(ips.toFixed(2))
        });
        }

        const ipk = totalSks === 0 ? 0 : totalMutu / totalSks;

        res.json({
            ipk: parseFloat(ipk.toFixed(2)),
            detail: ipkPerSemester
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menghitung IPK" });
    }
};
