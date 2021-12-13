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
    estadoAdmision: {
        type: String,
        trim: true
    },  
    estadoFichaMatricula: {
        type: String,
        trim: true
    },  
    estadoConstancia: {
        type: String,
        trim: true
    },  
    estadoCertificado: {
        type: String,
        trim: true
    },  
    estadoCertoNoAdeu: {
        type: String,
        trim: true
    },  
    estadoLibreMatri: {
        type: String,
        trim: true
    },  
    estadoComportamiento: {
        type: String,
        trim: true
    },  
    estadoCopiaDNI: {
        type: String,
        trim: true
    },  
    estadoDniEst: {
        type: String,
        trim: true
    },  
    estadoDniApo: {
        type: String,
        trim: true
    },  
    estadoLibreta: {
        type: String,
        trim: true
    },  
    estadoProgramacion: {
        type: String,
        trim: true
    },
    estadoFirma: {
        type: String,
        trim: true
    },
    estadoMatricula: {
        type: String,
        trim: true,
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