import MataKuliah from '../models/MataKuliah'
import { Request, Response } from 'express'

export const getAllMataKuliah = async (req: Request, res: Response) => {
    const data = await MataKuliah.find()
    res.json(data)
}

export const getMataKuliahByCodeMK = async (req: Request, res: Response) => {
    const data = await MataKuliah.findOne({ code_mk: req.params.code_mk })
    if (!data) {
        res.status(404).json({ message: 'Mata kuliah tidak ditemukan' });
        return;
    }
    res.json(data)
}

export const createMataKuliah = async (req: Request, res: Response) => {
    try {
        const existing = await MataKuliah.findOne({ code_mk: req.body.code_mk });
        if (existing) {
            res.status(409).json({ message: 'Mata kuliah sudah terdaftar' });
            return;
        }

        const data = new MataKuliah(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan mata kuliah', error });
    }
};

export const updateMataKuliah = async (req: Request, res: Response) => {
    const data = await MataKuliah.findOneAndUpdate(
        { code_mk: req.params.code_mk },
        req.body,
        { new: true }
    )
    if (!data) {
        res.status(404).json({ message: 'Mata kuliah tidak ditemukan' });
        return;
    }
    res.json(data)
}

export const deleteMataKuliah = async (req: Request, res: Response) => {
    const data = await MataKuliah.findOneAndDelete({ code_mk: req.params.code_mk })
    if (!data) {
        res.status(404).json({ message: 'Mata kuliah tidak ditemukan' });
        return;
    }
    res.status(204).send()
}

