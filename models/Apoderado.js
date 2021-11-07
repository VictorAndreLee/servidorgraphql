const mongoose = require ('mongoose');

const ApoderadoSchema = mongoose.Schema({
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
    dni: {
        type: String,
        // required: true,
        trim: true
    }, 
    celular: {
        type: Number,
        // required: true,
        trim: true
    }, 
    nacimiento: {
        type: Date,
        // require: true,
        trim: true
    },
    alumno: [
        {
          type: Object,
        //   require: true,
        },
    ],
    correo: {
        type: String,
        // required: true,
        trim: true
    },
    distrito: {
        type: String,
        // required: true,
        trim: true
    },
    direccion: {
        type: String,
        // required: true,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    } 
});

module.exports = mongoose.model('Apoderado', ApoderadoSchema)