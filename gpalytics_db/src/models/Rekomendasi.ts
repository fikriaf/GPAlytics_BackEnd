import mongoose from 'mongoose';

const RekomendasiSchema = new mongoose.Schema({
    id_mahasiswa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mahasiswa',
        required: true
    },
    rekomendasi: String,
    dibuat: {
        type: Date,
        default: Date.now
    },

}, {

    collection: "rekomendasi",
    strict: false

});

export default mongoose.model('Rekomendasi', RekomendasiSchema);
