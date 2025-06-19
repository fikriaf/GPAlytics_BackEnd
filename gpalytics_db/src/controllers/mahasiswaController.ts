import Mahasiswa from '../models/Mahasiswa'
import { Request, Response } from 'express'

export const getAllMahasiswa = async (req: Request, res: Response) => {
    const data = await Mahasiswa.find()
    res.json(data)
}

export const getMahasiswaByEmail = async (req: Request, res: Response) => {
    const data = await Mahasiswa.findOne({ email: req.params.email })
    if (!data) {
        res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        return;
    }
    res.json(data)
}

export const createMahasiswa = async (req: Request, res: Response) => {
    try {
        const existing = await Mahasiswa.findOne({ email: req.body.email });
        if (existing) {
            res.status(409).json({ message: 'Email sudah terdaftar' });
            return;
        }

        const data = new Mahasiswa(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan mahasiswa', error });
    }
};

export const updateMahasiswa = async (req: Request, res: Response) => {
    const data = await Mahasiswa.findOneAndUpdate(
        { email: req.params.email },
        req.body,
        { new: true }
    )
    if (!data) {
        res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        return;
    }
    res.json(data)
}

export const deleteMahasiswa = async (req: Request, res: Response) => {
    const data = await Mahasiswa.findOneAndDelete({ email: req.params.email })
    if (!data) {
        res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        return;
    }
    res.status(204).send()
}
