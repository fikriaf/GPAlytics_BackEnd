import mongoose from "mongoose";

const DataNilaiSchema = new mongoose.Schema({
    id_mahasiswa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mahasiswa',
        required: true
    },
    id_mk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MataKuliah',
        required: true
    },
    nilai: Number,
    tipe_nilai: String,
    semester: Number
},{

    collection: 'data_nilai',
    strict: false

});

export default mongoose.model('DataNilai', DataNilaiSchema)