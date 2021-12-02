const mongoose = require ('mongoose');

const AdmisionSchema = mongoose.Schema({
    apoderado: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    estadoPostulacion: {
        type: String,
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
        type: Date,
        default: Date.now()
    } 
});

module.exports = mongoose.model('Admision', AdmisionSchema)