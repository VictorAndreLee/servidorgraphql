const mongoose = require ('mongoose');

const GradoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    nivel: {
        type: String,
        required: true,
        trim: true
    },  
    aforo: {
        type: Number,
        require: true,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    } 
});

module.exports = mongoose.model('Grado', GradoSchema)