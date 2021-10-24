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
    direccion: {
        type: String,
        required: true,
        trim: true
    },
    fecha_nacimiento: {
        type: String,
        required: true,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    } 
});

module.exports = mongoose.model('Alumno', AlumnosSchema)