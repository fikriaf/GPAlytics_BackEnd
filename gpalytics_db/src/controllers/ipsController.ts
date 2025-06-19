import { Request, Response } from "express";
import DataNilai from "../models/DataNilai";
import mongoose from "mongoose";

export const getIPSByMahasiswa = async (req: Request, res: Response) => {
    const { id_mahasiswa, semester } = req.query;
    if (!id_mahasiswa || typeof id_mahasiswa !== 'string' || !mongoose.Types.ObjectId.isValid(id_mahasiswa)) {
        res.status(400).json({ message: "id_mahasiswa tidak valid atau tidak dikirim" });
        return
    }

    try {
        const allNilai = await DataNilai.find({ id_mahasiswa }).populate("id_mk");

        if (!semester) {
            const grouped: Record<number, any[]> = {};
            for (const item of allNilai) {
                const smt = item.semester ?? 0;
                if (!grouped[smt]) grouped[smt] = [];
                grouped[smt].push(item);
            }

            const hasilIPS: any[] = [];

            for (const smt in grouped) {
                const nilaiList = grouped[Number(smt)];
                const { ips, rincian } = hitungIPS(nilaiList);
                hasilIPS.push({
                    semester: Number(smt),
                    ips,
                    nilai: rincian
                });
            }

            res.json({ semuaSemester: hasilIPS });
            return
        }

        const nilaiList = allNilai.filter(n => n.semester === Number(semester));
        const { ips, rincian } = hitungIPS(nilaiList);

        res.json({
            semester: Number(semester),
            ips,
            nilai: rincian
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menghitung IPS", error: err });
    }
};

// Fungsi untuk hitung IPS per daftar nilai
function hitungIPS(nilaiList: any[]) {
    const nilaiPerMatkul: Record<string, {
        tugas?: number;
        uts?: number;
        uas?: number;
        sks: number;
        penilaian: { tugas: number; uts: number; uas: number };
    }> = {};

    for (const item of nilaiList) {
        const mk = item.id_mk as any;
        if (!mk || !mk._id) {
            console.warn("❌ Mata kuliah tidak ditemukan atau tidak ter-populate:", item);
            continue;
        }

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

    let totalMutu = 0;
    let totalSks = 0;
    const rincianNilai: any[] = [];

    for (const mkId in nilaiPerMatkul) {
        const matkul = nilaiPerMatkul[mkId];

        const { tugas = 0, uts = 0, uas = 0, sks, penilaian } = matkul;

        const nilaiAkhir = (
            (tugas * (penilaian.tugas || 0)) +
            (uts * (penilaian.uts || 0)) +
            (uas * (penilaian.uas || 0))
        ) / 100;

        const mutu = getBobotMutu(nilaiAkhir) * sks;
        totalMutu += mutu;
        totalSks += sks;

        rincianNilai.push({
            tugas,
            uts,
            uas,
            sks,
            nilaiAkhir: parseFloat(nilaiAkhir.toFixed(2)),
            mutu: parseFloat((mutu / sks).toFixed(2)),
        });
    }

    const ips = totalSks === 0 ? 0 : totalMutu / totalSks;

    return {
        ips: parseFloat(ips.toFixed(2)),
        rincian: rincianNilai,
    };
}

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
