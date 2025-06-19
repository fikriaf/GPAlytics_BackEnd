import mongoose from 'mongoose';

const mahasiswaSchema = new mongoose.Schema({
    nama: String,
    nim: String,
    prodi: String,
    angkatan: Number,
    gender: String,
    umur: String,
    photo: String,
    email: String,
    password: String
}, {

    collection: 'mahasiswa',
    strict: false

});

export default mongoose.model('Mahasiswa', mahasiswaSchema);
