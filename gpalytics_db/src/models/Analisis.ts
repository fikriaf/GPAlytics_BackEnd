import mongoose from 'mongoose'

const Analisis = new mongoose.Schema({
    id_mahasiswa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mahasiswa',
        required: true
    },
    ipk: Number,
    prediksi_ipk: Number,
    tahun_masuk: Number,
    prediksi_lulus: Number,
    status: String,
    catatan: String,
    jumlah_sks_lulus: Number,
    jumlah_sks_tidak_lulus: Number
}, {

    collection: 'analisis',
    strict: false

})

export default mongoose.model("Analisis", Analisis)