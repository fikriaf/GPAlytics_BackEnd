import mongoose from "mongoose";

const mataKuliahSchema = new mongoose.Schema({
    code_mk: String,
    nama_mk: String,
    sks: Number,
    penilaian: {
        tugas: Number,
        uts: Number,
        uas: Number
    }

}, {

    collection: "mata_kuliah",
    strict: false

})

export default mongoose.model("MataKuliah", mataKuliahSchema)