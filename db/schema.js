const { gql } = require('apollo-server-express');

//Schema
const typeDefs = gql`

scalar Upload
scalar Date
scalar AlumnoData

enum TipoUsuario {
    ADMINISTRADOR
    ESTUDIANTE
}

enum Estado {
    Pendiente
    RevisionPendiente
    Bloqueado
    Rechazado
    Aprobado
    ProgramacionPendiente
}
    #Types
    type Usuario {
        id: ID
        nombre: String
        apellido: String
        tipoUsuario: String
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
        apoderado: [Alumno]
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

    type Admision {
        id: ID
        apoderado: ID
        estadoPostulacion: Estado
        estadoProgramacion: Estado
        estadoFirma: Estado
        estadoMatricula: Estado
        copias: [String]
        constancias: [String]
    }

    #type Copias {
    #    dni_estudiante: String
    #    dni_apoderado: String
    #    libreta: String
    #}
#
    #type Constancias {
    #    ficha_unica_matricula: String
    #    const_matricula: String
    #    cert_estudios: String
    #    res_traslado: String
    #    foto: String
    #}

    #Inputs
    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        tipoUsuario: TipoUsuario!
        password: String!
    }

    input AutenticarInput{
        email: String!
        password: String!
    }

    input AlumnoInput {
        nombre: String!
        apellido: String!
        nacimiento: Date
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
        dni: String
        correo: String
        celular: String
        nacimiento: Date
        distrito: String
        direccion: String
    }

    input ApoderadoInput {
        nombre: String!
        apellido: String!
        dni: String
        correo: String
        celular: String
        nacimiento: Date
        distrito: String
        direccion: String
        alumno: AlumnoData
    }

    input CursoInput {
        nombre: String!
    }

    input AdmisionInput {
        apoderado: ID!
        estadoPostulacion: Estado!
        estadoProgramacion: Estado!
        estadoFirma: Estado!
        estadoMatricula: Estado!
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
        obtenerApoderado(id: ID!) : Apoderado

        #Curso
        obtenerCursos: [Curso]
        obtenerCurso(id: ID!) : Curso

        #Obtener admisiones
        obtenerAdmisiones: [Admision]
        obtenerAdmisionEstadoPostulacion(estado: String!): [Admision]
        obtenerAdmisionEstadoProgramacion(estado: String!): [Admision]
        obtenerAdmisionEstadoFirma(estado: String!): [Admision]
        obtenerAdmisionEstadoMatricula(estado: String!): [Admision]

        
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
        
        #Admision
        nuevaAdmision(input: AdmisionInput, file1: Upload, file2: Upload, file3: Upload) : String
    }
`;

module.exports = typeDefs;