const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`
    
    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }

    type Token {
        token: String
    }
    
    type Alumno {
        id: ID
        nombre: String
        apellido: String
        direccion: String
        fecha_nacimiento: String
        creado: String
    }

    

    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    input AutenticarInput{
        email: String!
        password: String!
    }

    type Query{
        #Usuarios
        obtenerUsuario : Usuario

        #Alumnos
        obtenerAlumno: [Alumno]
        obtenerAlumnos(id: ID!) : Alumno

    }

    input AlumnoInput{
        nombre: String!
        apellido: String!
        direccion: String!
        fecha_nacimiento: String!
    }


    type Mutation{
        #Usuarios
        nuevoUsuario(input : UsuarioInput): Usuario
        autenticarUsuario(input: AutenticarInput): Token
        
        #Alumnos
        nuevoAlumno(input: AlumnoInput) : Alumno
        actualizarAlumno( id: ID!, input : AlumnoInput) : Alumno
        eliminarAlumno( id: ID!) : String
    }
`;

module.exports = typeDefs;