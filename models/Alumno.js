const mongoose = require ('mongoose');

const AlumnosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },  

    nacimiento: {
        type: Date,
        // require: true,
        trim: true
    },
    docNum: {
        type: String,
        // require: true,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    } 
});

module.exports = mongoose.model('Alumno', AlumnosSchema)