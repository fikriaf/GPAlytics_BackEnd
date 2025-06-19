import Rekomendasi from '../models/Rekomendasi';
import { Request, Response } from 'express';

export const getAllRekomendasi = async (req: Request, res: Response) => {
    const data = await Rekomendasi.find().populate('id_mahasiswa id_analisis');
    res.json(data);
};

export const getRekomendasiById = async (req: Request, res: Response) => {
    const data = await Rekomendasi.findById(req.params.id).populate('id_mahasiswa id_analisis');
    res.json(data);
};

export const createRekomendasi = async (req: Request, res: Response) => {
    const data = new Rekomendasi(req.body);
    await data.save();
    res.status(201).json(data);
};
