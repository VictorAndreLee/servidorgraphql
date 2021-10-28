const mongoose = require ('mongoose');

const CursoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Curso', CursoSchema)