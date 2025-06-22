import { Request, Response } from "express";
import mongoose from "mongoose";
import DataNilai from "../models/DataNilai";

export const getDaftarNilaiLengkap = async (req: Request, res: Response) => {
    const { id_mahasiswa } = req.query;

    if (!id_mahasiswa || typeof id_mahasiswa !== 'string' || !mongoose.Types.ObjectId.isValid(id_mahasiswa)) {
        res.status(400).json({ message: "id_mahasiswa tidak valid atau tidak dikirim" });
        return
    }

    try {
        const nilaiList = await DataNilai.find({ id_mahasiswa }).populate("id_mk");
        
        // Gabungkan nilai per mata kuliah per semester
        const gabungNilai: Record<string, {
            idNilai: string[];
            mataKuliah: string;
            sks: number;
            semester: number;
            nilaiTugas?: number;
            nilaiUTS?: number;
            nilaiUAS?: number;
        }> = {};

        for (const item of nilaiList) {
            const mk = item.id_mk as any;
            if (!mk || !mk._id) continue;

            const key = mk._id.toString() + "-" + item.semester;
            if (!gabungNilai[key]) {
                gabungNilai[key] = {
                    idNilai: [],
                    mataKuliah: mk.nama_mk || "Tanpa Nama",
                    sks: mk.sks ?? 0,
                    semester: item.semester ?? 0,
                };
            }

            const rawTipe = item.tipe_nilai;
            if (typeof rawTipe === "string") {
                const tipe = rawTipe.toLowerCase();
                if (["tugas", "uts", "uas"].includes(tipe)) {
                    if (item._id) {
                        gabungNilai[key].idNilai.push(item._id.toString() ?? '');
                    }
                    if (tipe === "tugas") gabungNilai[key].nilaiTugas = item.nilai ?? 0;
                    if (tipe === "uts") gabungNilai[key].nilaiUTS = item.nilai ?? 0;
                    if (tipe === "uas") gabungNilai[key].nilaiUAS = item.nilai ?? 0;
                }
            }
        }

        const hasil = Object.values(gabungNilai);

        if (hasil.length === 0) {
            res.status(404).json({ message: "Tidak ada data nilai ditemukan" });
            return
        }

        res.json(hasil);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil data nilai" });
    }
};

export const createDataNilai = async (req: Request, res: Response) => {
    try {
        const { id_mahasiswa, id_mk, nilai, tipe_nilai, semester } = req.body;

        if (!id_mahasiswa || !id_mk || nilai == null || !tipe_nilai || semester == null) {
            res.status(400).json({ message: 'Semua field harus diisi.' });
            return;
        }

        const newDataNilai = new DataNilai({
            id_mahasiswa,
            id_mk,
            nilai,
            tipe_nilai,
            semester
        });

        const savedData = await newDataNilai.save();
        res.status(201).json(savedData);
        
    } catch (err) {
        console.error('Error saat menyimpan data nilai:', err);
        res.status(500).json({ message: 'Gagal menyimpan data nilai.' });
    }
};

export const deleteDataNilai = async (req: Request, res: Response) => {
    try {
        const { id_nilai } = req.body;

        if (!id_nilai) {
            res.status(400).json({ message: "Parameter 'id_nilai' tidak lengkap." });
            return
        }

        const data = await DataNilai.findById(id_nilai);

        if (!data) {
            res.status(404).json({ message: 'Data nilai tidak ditemukan.' });
            return
        }

        await DataNilai.deleteOne({ _id: id_nilai });

        res.json({ message: 'Data nilai berhasil dihapus.' });
    } catch (err) {
        console.error('Error saat menghapus data nilai:', err);
        res.status(500).json({ message: 'Gagal menghapus data nilai.' });
    }
};




export const editDataNilai = async (req: Request, res: Response) => {
    try {
        const { id_nilai, nilai: nilaiBaru } = req.body;

        if (!id_nilai || nilaiBaru == null) {
            res.status(400).json({ message: "Parameter 'id_nilai' atau 'nilai' tidak lengkap." });
            return;
        }

        const updated = await DataNilai.findByIdAndUpdate(
            id_nilai,
            { nilai: Number(nilaiBaru) },
            { new: true }
        );

        if (!updated) {
            res.status(404).json({ message: "Data nilai tidak ditemukan." });
            return;
        }

        res.json({ message: "Data nilai berhasil diperbarui.", data: updated });
    } catch (err) {
        console.error("Error saat mengedit data nilai:", err);
        res.status(500).json({ message: "Gagal mengedit data nilai." });
    }
};

