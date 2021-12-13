const { gql } = require('apollo-server-express');

//Schema
const typeDefs = gql`

scalar Upload
scalar Date
scalar AlumnoData
scalar Estados

enum TipoUsuario {
    ADMINISTRADOR
    ESTUDIANTE
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
        estadoAdmision: String
        estadoProgramacion: String
        estadoFirma: String
        estadoMatricula: String
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
        idApoderado: ID
        nombreApoderado: String
        apellidoApoderado: String
        estadoAdmision: String
        estadoDniEst: String
        estadoDniApo: String
        estadoLibreta: String
        estadoProgramacion: String
        estadoFirma: String
        estadoMatricula: String
        copias: [String]
        constancias: [String]
        estadoFichaMatricula: String
        estadoConstancia: String
        estadoCertificado: String
        estadoCertoNoAdeu: String
        estadoLibreMatri: String
        estadoComportamiento: String
        estadoCopiaDNI: String
        creado:String
    }

    type Periodo {
        id: ID
        nombre: String
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
        idApoderado: ID!
        nombreApoderado: String!
        apellidoApoderado: String!
        estadoAdmision: String
        estadoDniEst: String
        estadoDniApo: String
        estadoLibreta: String
        estadoProgramacion: String
        estadoFirma: String
        estadoMatricula: String
        estadoFichaMatricula: String
        estadoConstancia: String
        estadoCertificado: String
        estadoCertoNoAdeu: String
        estadoLibreMatri: String
        estadoComportamiento: String
        estadoCopiaDNI: String
    }

    input PeriodoInput {
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
        obtenerApoderado(id: ID!) : Apoderado
        obtenerApoderadoEstado: Admision

        #Curso
        obtenerCursos: [Curso]
        obtenerCurso(id: ID!) : Curso

        #Obtener admisiones
        obtenerAdmisiones: [Admision]
        obtenerAdmisionesApoderado(id: ID): Admision
        obtenerAdmisionEstadoPostulacion(estado: String!): [Admision]
        obtenerAdmisionEstadoProgramacion(estado: String!): [Admision]
        obtenerAdmisionEstadoFirma(estado: String!): [Admision]
        obtenerAdmisionEstadoMatricula(estado: String!): [Admision]

        #Obtener periodo
        obtenerPeriodos: [Periodo]
        obtenerPeriodo(id: ID!): Periodo
        
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
        actualizarEstadoAdmision( id:ID! , input: String! ) : String
        actualizarEstadoDniEst( id:ID! , input: String! ) : String
        actualizarEstadoDniApo( id:ID! , input: String! ) : String
        actualizarEstadoLibreta( id:ID! , input: String! ) : String
        actualizarEstadoProgramacion( id:ID! , input: String! ) : String
        actualizarEstadoFirma( id:ID! , input: String! ) : String
        actualizarEstadoMatricula( id:ID! , input: String! ) : String

        nuevaMatricula(input: AdmisionInput, file1: Upload, file2: Upload, file3: Upload,  file4: Upload, file5: Upload, file6: Upload, file7: Upload) : String
        #Periodo
        nuevoPeriodo(input: PeriodoInput) : Periodo
        actualizarPeriodo( id: ID!, input : PeriodoInput) : Periodo
        eliminarPeriodo( id: ID!) : String
    }
`;

module.exports = typeDefs;