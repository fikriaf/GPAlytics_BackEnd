import Rekomendasi from '../models/Rekomendasi';
import { Request, Response } from 'express';

export const getAllRekomendasi = async (req: Request, res: Response) => {
    try {
        const data = await Rekomendasi.find();
        res.json(data);
    } catch (err) {
        console.error('Gagal mengambil data rekomendasi:', err);
        res.status(500).json({ message: 'Gagal mengambil data rekomendasi' });
    }
};

export const getRekomendasiById = async (req: Request, res: Response) => {
    try {
        const data = await Rekomendasi.findOne({id_mahasiswa: req.params.id});
        if (!data) {
            res.status(404).json({ message: 'Rekomendasi tidak ditemukan' });
            return
        }
        res.json(data);
    } catch (err) {
        console.error('Gagal mengambil rekomendasi:', err);
        res.status(500).json({ message: 'Gagal mengambil data rekomendasi' });
    }
};

export const createRekomendasi = async (req: Request, res: Response) => {
    const { id_mahasiswa, rekomendasi } = req.body;

    if(!id_mahasiswa || !rekomendasi) return;

    try {
        const data = new Rekomendasi({
            id_mahasiswa,
            rekomendasi
        });

        await data.save();
        res.status(201).json(data);
    } catch (err) {
        console.error('Gagal membuat rekomendasi:', err);
        res.status(500).json({ message: 'Gagal membuat data rekomendasi' });
    }
};



export const editRekomendasi = async (req: Request, res: Response) => {
    try {
        const data = await Rekomendasi.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new: true}
        )
        if (!data) {
            res.status(404).json({ message: 'Data Rekomendasi tidak ditemukan' })
        }
        res.json({message: "Sukses diperbarui", data})
    } catch (error) {
        console.error('Gagal edit data Rekomendasi:', error);
        res.status(500).json({ message: 'Gagal edit data Rekomendasi' });
    }
}