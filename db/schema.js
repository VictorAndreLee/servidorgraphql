const { gql } = require('apollo-server');



//Schema
const typeDefs = gql`
scalar Date
    
    #Types
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
        nacimiento: Date
        apoderado: ID
        docNum:String
        creado: String
    }

    type Grado {
        id: ID
        nombre: String
        nivel: String
        aforo: Int
        creado: String
    }

    type Profesor {
        id: ID
        nombre: String
        apellido: String
        dni: String
        correo: String
        celular: String
        nacimiento: Date
        distrito: String
        direccion: String
        creado: String
    }

    type Apoderado {
        id: ID
        nombre: String
        apellido: String
        dni: String
        correo: String
        celular: String
        nacimiento: Date
        distrito: String
        direccion: String
        creado: String
    }

    type Curso {
        id: ID
        nombre: String
        creado: String
    }


    #Inputs
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

    input AlumnoInput {
        nombre: String!
        apellido: String!
        nacimiento: Date!
        apoderado: ID!
        docNum: String
    }

    input GradoInput {
        nombre: String!
        nivel: String!
        aforo: Int!
    }

    input ProfesorInput {
        nombre: String!
        apellido: String!
        dni: String!
        correo: String!
        celular: String!
        nacimiento: Date!
        distrito: String!
        direccion: String!
    }

    input ApoderadoInput {
        nombre: String!
        apellido: String!
        dni: String!
        correo: String!
        celular: String!
        nacimiento: Date!
        distrito: String!
        direccion: String!
    }

    input CursoInput {
        nombre: String!
    }

    type Query{
        #Usuarios
        obtenerUsuario : Usuario

        #Alumnos
        obtenerAlumnos: [Alumno]
        obtenerAlumno(id: ID!) : Alumno
        
        #Grados
        obtenerGrados: [Grado]
        obtenerGrado(id: ID!) : Grado

        #Profesor
        obtenerProfesores: [Profesor]
        obtenerProfesor(id: ID!) : Profesor

        #Apoderado
        obtenerApoderados: [Apoderado]
        obtenerApoderado(id: ID!) :Apoderado

        #Curso
        obtenerCursos: [Curso]
        obtenerCurso(id: ID!) : Curso
    }

    type Mutation{
        #Usuarios
        nuevoUsuario(input : UsuarioInput): Usuario
        autenticarUsuario(input: AutenticarInput): Token
        
        #Alumnos
        nuevoAlumno(input: AlumnoInput) : Alumno
        actualizarAlumno( id: ID!, input : AlumnoInput) : Alumno
        eliminarAlumno( id: ID!) : String

        #Grados
        nuevoGrado(input: GradoInput) : Grado
        actualizarGrado( id: ID!, input : GradoInput) : Grado
        eliminarGrado( id: ID!) : String

        #Profesor
        nuevoProfesor(input: ProfesorInput) : Profesor
        actualizarProfesor( id: ID!, input : ProfesorInput) : Profesor
        eliminarProfesor( id: ID!) : String

        #Apoderado
        nuevoApoderado(input: ApoderadoInput) : Apoderado
        actualizarApoderado( id: ID!, input : ApoderadoInput) : Apoderado
        eliminarApoderado( id: ID!) : String

        #Curso
        nuevoCurso(input: CursoInput) : Curso
        actualizarCurso( id: ID!, input : CursoInput) : Curso
        eliminarCurso( id: ID!) : String
        
    }
`;

module.exports = typeDefs;