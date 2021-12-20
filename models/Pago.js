const mongoose = require ('mongoose');

const PagoSchema = mongoose.Schema({
    idApoderado: {
        type: String,
        required: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },  
    apellido: {
        type: String,
        require: true,
        trim: true
    },
    motivo: {
        type: String,
        trim: true
    },
    monto: {
        type: Number,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    } 
});

module.exports = mongoose.model('Pago', PagoSchema)