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
                    mataKuliah: mk.nama_mk || "Tanpa Nama",
                    sks: mk.sks ?? 0,
                    semester: item.semester ?? 0,
                };
            }

            const rawTipe = item.tipe_nilai;
            if (typeof rawTipe === "string") {
                const tipe = rawTipe.toLowerCase();
                if (["tugas", "uts", "uas"].includes(tipe)) {
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
        const { id_mahasiswa, semester, tipe_nilai, nilai } = req.params;
        const { nama_mk } = req.body;

        if (!id_mahasiswa || !semester || !tipe_nilai || !nilai || !nama_mk) {
            res.status(400).json({ message: "Parameter tidak lengkap." });
            return;
        }

        const data = await DataNilai.findOne({
            id_mahasiswa,
            semester: Number(semester),
            tipe_nilai: new RegExp(`^${tipe_nilai}$`, 'i'),
            nilai: { $eq: Number(nilai) }
        }).populate('id_mk');

        if (!data || !data.id_mk) {
            res.status(404).json({ message: 'Data nilai tidak ditemukan.' });
            return;
        }

        const mk = (data.id_mk as any)?.nama_mk?.toLowerCase();
        if (!mk || mk !== nama_mk.toLowerCase()) {
            res.status(404).json({ message: 'Data nilai tidak ditemukan.' });
            return;
        }

        await data.deleteOne();

        res.json({ message: 'Data nilai berhasil dihapus.' });
        return;
    } catch (err) {
        console.error('Error saat menghapus data nilai:', err);
        res.status(500).json({ message: 'Gagal menghapus data nilai.' });
        return;
    }
};



export const editDataNilai = async (req: Request, res: Response) => {
    try {
        const { id_mahasiswa, semester, tipe_nilai, nilai: nilaiLama } = req.params;
        const { nilai: nilaiBaru } = req.body;

        if (!id_mahasiswa || !semester || !tipe_nilai || nilaiLama == null || nilaiBaru == null) {
            res.status(400).json({ message: "Parameter tidak lengkap" });
            return
        }

        const updated = await DataNilai.findOneAndUpdate(
            {
                id_mahasiswa,
                semester: Number(semester),
                tipe_nilai,
                nilai: Number(nilaiLama),
            },
            { nilai: Number(nilaiBaru) },
            { new: true }
        );

        if (!updated) {
            res.status(404).json({ message: "Data nilai tidak ditemukan." });
            return
        }

        res.json({ message: "Data nilai berhasil diperbarui.", data: updated });
    } catch (err) {
        console.error("Error saat mengedit data nilai:", err);
        res.status(500).json({ message: "Gagal mengedit data nilai." });
    }
};
