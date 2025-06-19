import mongoose from 'mongoose';

const RekomendasiSchema = new mongoose.Schema({
    id_mahasiswa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mahasiswa',
        required: true
    },
    id_analisis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analisis',
        required: true
    },
    rekomendasi: [
        {
        fokus: String,
        komponen: String,
        alasan: String,
        saran: String
        }
    ],
    kategori_risiko: String,
    dibuat: {
        type: Date,
        default: Date.now
    },

}, {

    collection: "rekomendasi",
    strict: false

});

export default mongoose.model('Rekomendasi', RekomendasiSchema);
