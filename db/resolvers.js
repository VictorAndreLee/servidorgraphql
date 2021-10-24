const Usuario = require('../models/Usuario');
const Alumno = require('../models/Alumno');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env'});

const crearToken = (usuario, secreta, expiresIn) => {
    //console.log(usuario);
    const {id, email, nombre, apellido} = usuario;
    return jwt.sign({ id, email, nombre, apellido }, secreta, {expiresIn})
}

//Resolvers
const resolvers = {
    Query: {
        
        obtenerUsuario: async (_, {token}) =>{
            const usuarioId = await jwt.verify(token, process.env.SECRETA)
            return usuarioId
        },
        obtenerAlumno: async () => {
           try {
              const alumno = await Alumno.find({});
               return alumno;
           } catch (error) {
                console.log(error);  
            }
        },
        obtenerAlumnos: async (_, {id}) => {
            //Revisar si el alumno existe o no
            const alumno = await Alumno.findById(id);
            if(!alumno){
                throw new Error('Alumno no encontrado')
            }

            return alumno;
        }
    },   
    
    Mutation: {
        nuevoUsuario: async (_, {input}) => {
            
            const { email, password } = input;

            //Revisar si el usuario ya esta registrado
            const existeUsuario = await Usuario.findOne({email});
            if (existeUsuario) { 
                throw new Error('El usuario ya esta registrado');
            }

            //Hashear su password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);


            try {
                //Guardarlo en la base de datos
                const usuario = new Usuario(input);
                usuario.save(); //guardarlo
                return usuario;
            } catch (error) {
                console.log(error);
            }
        },
        autenticarUsuario: async (_, {input}) => {
            const {email, password} = input;

            //Si el usuario existe
            const existeUsuario = await Usuario.findOne({email});
            if(!existeUsuario){
                throw new Error('El usuario no existe');
            }

            //Revisar si el password es correcto 
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if(!passwordCorrecto){
                throw new Error('El password es incorrecto');
            }

            //Crear el token
            return {
                token : crearToken(existeUsuario, process.env.SECRETA, '24h')     
            }
        },

        nuevoAlumno: async (_, {input}) => {
            try {
                const alumno = new Alumno(input);

                // Almacenar en la bd
                const resultado = await alumno.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
        },

        actualizarAlumno: async (_, {id, input}) => {
            //Revisar si el alumno existe o no
            let alumno = await Alumno.findById(id);
            if(!alumno){
                throw new Error('Alumno no existe')
            }

            //Guardarlo en la base de datos
            alumno = await Alumno.findOneAndUpdate({_id: id}, input, {new: true});

            return alumno;

        },
        eliminarAlumno: async (_, {id}) => {
            //Revisar si el alumno existe o no
            let alumno = await Alumno.findById(id);
            if(!alumno){
                throw new Error('Alumno no existe')
            }

            //Eliminar
            await Alumno.findOneAndDelete({_id : id});
            return "Alumno Eliminado"
        }

    }
}

module.exports = resolvers;