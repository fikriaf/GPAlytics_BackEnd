import { Request, Response } from "express";
import Analisis from "../models/Analisis";
import mongoose from "mongoose";

export const getAllAnalisis = async (req: Request, res: Response) => {
    try {
        const data = await Analisis.find();
        res.json(data);
    } catch (err) {
        console.error('Gagal mengambil data analisis:', err);
        res.status(500).json({ message: 'Gagal mengambil data analisis' });
    }
}

export const getAnalisisById = async (req: Request, res: Response) => {
    const { id_mahasiswa } = req.params;

    try {
        const data = await Analisis.findOne({id_mahasiswa: id_mahasiswa})
        if (!data) {
            res.status(404).json({ message: 'Analisis tidak ditemukan' });
            return
        }
        res.json(data)
    } catch (error) {
        console.error('Gagal mengambil data analisis:', error);
        res.status(500).json({ message: 'Gagal mengambil data analisis' });
    }
}

export const createAnalisis = async (req: Request, res: Response) => {
    const { id_mahasiswa, data } = req.body;

    try {
        const analisis = new Analisis({
            id_mahasiswa,
            ...data
        });

        await analisis.save();
        res.status(201).json(analisis);
    } catch (err) {
        console.error('Gagal membuat Analisis:', err);
        res.status(500).json({ message: 'Gagal membuat data Analisis' });
    }
};


export const editAnalisis = async (req: Request, res: Response) => {
    try {
        const data = await Analisis.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new: true}
        )
        if (!data) {
            res.status(404).json({ message: 'Data analisis tidak ditemukan' })
            return
        }
        res.json({message: "Sukses diperbarui", data})
    } catch (error) {
        console.error('Gagal edit data analisis:', error);
        res.status(500).json({ message: 'Gagal edit data analisis' });
    }
}