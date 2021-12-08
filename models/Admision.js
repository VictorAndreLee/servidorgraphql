const mongoose = require ('mongoose');

const timeElapsed = Date.now();
const today = new Date(timeElapsed);
const fecha = today.toLocaleDateString()
const AdmisionSchema = mongoose.Schema({
    idApoderado: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    nombreApoderado: {
        type: String,
        // require: true,
        trim: true,
    },
    apellidoApoderado: {
        type: String,
        // require: true,
        trim: true,
    },
    estadoPostulacion: {
        type: Object,
        required: true,
        trim: true,
        default: 'Pendiente'
    },  

    estadoProgramacion: {
        type: String,
        // require: true,
        trim: true,
        default: 'Bloqueado'
    },
    estadoFirma: {
        type: String,
        // require: true,
        trim: true,
        default: 'Bloqueado'
    },
    estadoMatricula: {
        type: String,
        trim: true,
        default: 'Bloqueado'
    },
    copias: {
        type: Array
    },
    constancias: {
        type: Array
    },
    creado: {
        type: String,
        default: fecha
    } 
});

module.exports = mongoose.model('Admision', AdmisionSchema)