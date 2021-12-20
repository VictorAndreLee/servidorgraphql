const Usuario = require("../models/Usuario");
const Apoderado = require("../models/Apoderado");
const Alumno = require("../models/Alumno");
const Grado = require("../models/Grado");
const Profesor = require("../models/Profesor");
const Pago = require("../models/Pago");
const Admision = require("../models/Admision");
const Curso = require("../models/Curso");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_TOKEN);

const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require("graphql-upload");

const shortid = require("shortid");
const awsUploadFiles = require("../utils/aws-uploads-files");
require("dotenv").config({ path: "variables.env" });

const crearToken = (usuario, secreta, expiresIn) => {
  //console.log(usuario);
  const { id, email, nombre, apellido, tipoUsuario } = usuario;
  return jwt.sign({ id, email, nombre, apellido, tipoUsuario }, secreta, {
    expiresIn,
  });
};

//Resolvers
const resolvers = {
  Query: {
    obtenerUsuario: async (_, {}, ctx) => {
      return ctx.usuario;
    },
    obtenerAlumnos: async () => {
      try {
        const alumno = await Alumno.find({});
        return alumno;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerAlumno: async (_, { id }) => {
      //Revisar si el alumno existe o no
      const alumno = await Alumno.findById(id);
      if (!alumno) {
        throw new Error("Alumno no encontrado");
      }

      return alumno;
    },
    obtenerGrados: async () => {
      try {
        const grado = await Grado.find({});
        return grado;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerGrado: async (_, { id }) => {
      //Revisar si el grado existe o no
      const grado = await Grado.findById(id);
      if (!grado) {
        throw new Error("Grado no encontrado");
      }

      return grado;
    },
    obtenerProfesores: async () => {
      try {
        const profesor = await Profesor.find({});
        return profesor;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerProfesor: async (_, { id }) => {
      //Revisar si el Profesor existe o no

      const profesor = await Profesor.findById(id);
      if (!profesor) {
        throw new Error("Profesor no encontrado");
      }

      return profesor;
    },
    obtenerApoderados: async () => {
      try {
        const apoderado = await Apoderado.find({});
        return apoderado;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerApoderado: async (_, { id }) => {
      //Revisar si el Profesor existe o no

      const apoderado = await Apoderado.findById(id);
      if (!apoderado) {
        throw new Error("Apoderado no encontrado");
      }

      return apoderado;
    },
    obtenerApoderadoEstado: async (_, {}, ctx) => {
      //Revisar si el Profesor existe o no
      console.log("asasas", ctx.usuario);
      const apoderado = await Admision.findOne({ idApoderado: ctx.usuario.id });
      if (!apoderado) {
        throw new Error("Apoderado no encontrado");
      }
      console.log("adadwqqqqqq", apoderado);
      return apoderado;
    },
    obtenerCursos: async () => {
      try {
        const dato = await Curso.find({});
        return dato;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerCurso: async (_, { id }) => {
      //Revisar si el Curso existe o no

      const dato = await Curso.findById(id);
      if (!dato) {
        throw new Error("Curso no encontrado");
      }

      return dato;
    },
    obtenerAdmisiones: async () => {
      //Revisar si el Curso existe o no
      try {
        const dato = await Admision.find({});
        return dato;
      } catch (error) {
        throw new Error("Ocurrió un error en las consultas");
      }
    },
    obtenerAdmisionesApoderado: async (_, {}, ctx) => {
      //Revisar si el Curso existe o no
      try {
        const dato = await Admision.findOne({ idApoderado: ctx.usuario });
        return dato;
      } catch (error) {
        throw new Error("Ocurrió un error en las consultas");
      }
    },
  },
  Upload: GraphQLUpload,
  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      const { email, password } = input;

      //Revisar si el usuario ya esta registrado
      const existeUsuario = await Usuario.findOne({ email });
      if (existeUsuario) {
        throw new Error("El usuario ya esta registrado");
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
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;

      //Si el usuario existe
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("El usuario no existe");
      }

      //Revisar si el password es correcto
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existeUsuario.password
      );
      if (!passwordCorrecto) {
        throw new Error("El password es incorrecto");
      }

      //Crear el token
      return {
        token: crearToken(existeUsuario, process.env.SECRETA, "24h"),
      };
    },

    // Alumno
    nuevoAlumno: async (_, { input }) => {
      const { docNum } = input;
      try {
        const alumno = new Alumno(input);

        // Revisar su el profesor ya está registrado anteriormente
        const existeUsuario = await Alumno.findOne({ docNum });
        if (existeUsuario) {
          throw new Error("El profesor ya está registrado");
        }

        // Almacenar en la bd
        const resultado = await alumno.save();

        return resultado;
      } catch (error) {
        console.log(error);
      }
    },

    actualizarAlumno: async (_, { id, input }) => {
      //Revisar si el alumno existe o no
      let alumno = await Alumno.findById(id);
      if (!alumno) {
        throw new Error("Alumno no existe");
      }

      //Guardarlo en la base de datos
      alumno = await Alumno.findOneAndUpdate({ _id: id }, input, { new: true });

      return alumno;
    },
    eliminarAlumno: async (_, { id }) => {
      //Revisar si el alumno existe o no
      let alumno = await Alumno.findById(id);
      if (!alumno) {
        throw new Error("Alumno no existe");
      }

      //Eliminar
      await Alumno.findOneAndDelete({ _id: id });
      return "Alumno Eliminado";
    },

    // Grado
    nuevoGrado: async (_, { input }) => {
      try {
        const grado = new Grado(input);

        // Almacenar en la bd
        const resultado = await grado.save();

        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarGrado: async (_, { id, input }) => {
      //Revisar si el grado existe o no
      let grado = await Grado.findById(id);
      if (!grado) {
        throw new Error("Grado no existe");
      }

      //Guardarlo en la base de datos
      grado = await Grado.findOneAndUpdate({ _id: id }, input, { new: true });

      return grado;
    },
    eliminarGrado: async (_, { id }) => {
      //Revisar si el grado existe o no
      let grado = await Grado.findById(id);
      if (!grado) {
        throw new Error("Grado no existe");
      }

      //Eliminar
      await Grado.findOneAndDelete({ _id: id });
      return "Grado Eliminado";
    },

    // Profesor
    nuevoProfesor: async (_, { input }) => {
      const { dni } = input;
      try {
        const profesor = new Profesor(input);

        // Revisar su el profesor ya está registrado anteriormente
        const existeUsuario = await Profesor.findOne({ dni });
        if (existeUsuario) {
          throw new Error("El profesor ya está registrado");
        }

        // Almacenar en la bd
        const resultado = await profesor.save();

        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarProfesor: async (_, { id, input }) => {
      //Revisar si el profesor existe o no
      let profesor = await Profesor.findById(id);
      if (!profesor) {
        throw new Error("Profesor no existe");
      }

      //Guardarlo en la base de datos
      profesor = await Profesor.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return profesor;
    },
    eliminarProfesor: async (_, { id }) => {
      //Revisar si el profesor existe o no
      let profesor = await Profesor.findById(id);
      if (!profesor) {
        throw new Error("Profesor no existe");
      }

      //Eliminar
      await Profesor.findOneAndDelete({ _id: id });
      return "Profesor Eliminado";
    },

    // Apoderado
    nuevoApoderado: async (_, { input }) => {
      const { dni, email } = input;
      try {
        // input.estadoAdmision = "Pendiente"
        // input.estadoProgramacion = "Bloqueado"
        // input.estadoFirma = "Bloqueado"
        // input.estadoMatricula = "Bloqueado"
        const apoderado = new Apoderado(input);

        // Revisar su el apoderado ya está registrado anteriormente
        const existeUsuario = await Apoderado.findOne({ dni, email });
        if (existeUsuario) {
          throw new Error("El apoderado ya está registrado");
        }

        // Almacenar en la bd
        const resultado = await apoderado.save();

        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarApoderado: async (_, { id, input }) => {
      //Revisar si el apoderado existe o no
      let apoderado = await Apoderado.findById(id);
      if (!apoderado) {
        throw new Error("Apoderado no existe");
      }

      //Guardarlo en la base de datos
      apoderado = await Apoderado.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return apoderado;
    },
    eliminarApoderado: async (_, { id }) => {
      //Revisar si el apoderado existe o no
      let apoderado = await Apoderado.findById(id);
      if (!apoderado) {
        throw new Error("Apoderado no existe");
      }

      //Eliminar
      await Apoderado.findOneAndDelete({ _id: id });
      return "Apoderado Eliminado";
    },

    // Curso
    nuevoCurso: async (_, { input }) => {
      const { nombre } = input;
      try {
        const dato = new Curso(input);

        // Revisar su el dato ya está registrado anteriormente
        const existeUsuario = await Curso.findOne({ nombre });
        if (existeUsuario) {
          throw new Error("El dato ya está registrado");
        }

        // Almacenar en la bd
        const resultado = await dato.save();

        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarCurso: async (_, { id, input }) => {
      //Revisar si el profesor existe o no
      let dato = await Curso.findById(id);
      if (!dato) {
        throw new Error("Curso no existe");
      }

      //Guardarlo en la base de datos
      dato = await Curso.findOneAndUpdate({ _id: id }, input, { new: true });

      return dato;
    },
    eliminarCurso: async (_, { id }) => {
      //Revisar si el dato existe o no
      let dato = await Curso.findById(id);
      if (!dato) {
        throw new Error("Curso no existe");
      }

      //Eliminar
      await Curso.findOneAndDelete({ _id: id });
      return "Curso Eliminado";
    },

    // Periodo
    nuevoPeriodo: async (_, { input }) => {
      const { nombre } = input;
      try {
        const dato = new Periodo(input);

        // Revisar su el dato ya está registrado anteriormente
        const existeUsuario = await Periodo.findOne({ nombre });
        if (existeUsuario) {
          throw new Error("El dato ya está registrado");
        }

        // Almacenar en la bd
        const resultado = await dato.save();

        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarPeriodo: async (_, { id, input }) => {
      //Revisar si el profesor existe o no
      let dato = await Periodo.findById(id);
      if (!dato) {
        throw new Error("Periodo no existe");
      }

      //Guardarlo en la base de datos
      dato = await Periodo.findOneAndUpdate({ _id: id }, input, { new: true });

      return dato;
    },
    eliminarPeriodo: async (_, { id }) => {
      //Revisar si el dato existe o no
      let dato = await Periodo.findById(id);
      if (!dato) {
        throw new Error("Periodo no existe");
      }

      //Eliminar
      await Periodo.findOneAndDelete({ _id: id });
      return "Periodo Eliminado";
    },

    // Admisión
    nuevaAdmision: async (_, { input, file1, file2, file3 }) => {
      const files = [await file1, await file2, await file3];

      let url = [];

      await files.map(async (element, i) => {
        element.filename = await shortid.generate();
        const { filename, createReadStream, mimetype } = element;
        const extension = await mimetype.replace("application/", "");
        const fileName = `copias/${filename}.${extension}`;
        const fileData = createReadStream();
        try {
          const resultado = await awsUploadFiles(fileData, fileName);
          url.push(resultado);
          return resultado;
        } catch (error) {
          console.log(error);
          return {
            status: false,
            urlAvatar: null,
          };
        }
      });

      setTimeout(async () => {
        input.copias = url;
        input.estadoAdmision = "Revisión pendiente";
        input.estadoDniEst = "Pendiente";
        input.estadoDniApo = "Pendiente";
        input.estadoLibreta = "Pendiente";
        input.estadoProgramacion = "Bloqueado";
        input.estadoFirma = "Bloqueado";
        input.estadoMatricula = "Bloqueado";

        input.estadoFichaMatricula = "Pendiente";
        input.estadoConstancia = "Pendiente";
        input.estadoCertificado = "Pendiente";
        input.estadoCertoNoAdeu = "Pendiente";
        input.estadoLibreMatri = "Pendiente";
        input.estadoComportamiento = "Pendiente";
        input.estadoCopiaDNI = "Pendiente";

        try {
          const admision = new Admision(input);

          const result = await admision.save();
          return result;
        } catch (error) {
          throw error;
        }
      }, 6000);
      return "Admisión solicitada";
    },
    // Admisión
    nuevaMatricula: async (
      _,
      { input, file1, file2, file3, file4, file5, file6, file7 }
    ) => {
      const files = [
        await file1,
        await file2,
        await file3,
        await file4,
        await file5,
        await file6,
        await file7,
      ];

      let url = [];

      await files.map(async (element, i) => {
        element.filename = await shortid.generate();
        const { filename, createReadStream, mimetype } = element;
        const extension = await mimetype.replace("application/", "");
        const fileName = `certificados/${filename}.${extension}`;
        const fileData = createReadStream();
        try {
          const resultado = await awsUploadFiles(fileData, fileName);
          url.push(resultado);
          return resultado;
        } catch (error) {
          console.log(error);
          return {
            status: false,
            urlAvatar: null,
          };
        }
      });

      setTimeout(async () => {
        try {
          const { idApoderado } = input;
          const links = url;
          const respuesta = await Admision.findOneAndUpdate(
            { idApoderado: idApoderado },
            { constancias: links, estadoMatricula: "Revisión pendiente" },
            { new: true }
          );
          return respuesta;
        } catch (error) {
          console.log("error", error);
          throw error;
        }
      }, 10000);
      return "Matrícula solicitada";
    },
    actualizarEstadoAdmision: async (_, { id, input }) => {
      try {
        await Admision.findOneAndUpdate(
          { _id: id },
          { estadoAdmision: input },
          { new: true }
        );
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarEstadoDniEst: async (_, { id, input }) => {
      try {
        const resultado = await Admision.findOneAndUpdate(
          { _id: id },
          { estadoDniEst: input },
          { new: true }
        );
        const { estadoDniEst, estadoDniApo, estadoLibreta } = resultado;
        if (
          (estadoDniEst === "Aprobado"&&
          estadoDniApo === "Aprobado"&&
          estadoLibreta === "Aprobado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            {
              estadoAdmision: "Aprobado",
              estadoProgramacion: "Programacion pendiente",
            },
            { new: true }
          );
        } else if (
          (estadoDniEst === "Rechazado"&&
          estadoDniApo === "Rechazado"&&
          estadoLibreta === "Rechazado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoAdmision: "Rechazado", estadoProgramacion: "Bloqueado" },
            { new: true }
          );
        } else {
          await Admision.findOneAndUpdate(
            { _id: id },
            {
              estadoAdmision: "Revisión pendiente",
              estadoProgramacion: "Bloqueado",
            },
            { new: true }
          );
        }
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarEstadoDniApo: async (_, { id, input }) => {
      try {
        const resultado = await Admision.findOneAndUpdate(
          { _id: id },
          { estadoDniApo: input },
          { new: true }
        );
        const { estadoDniEst, estadoDniApo, estadoLibreta } = resultado;
        if (
          (estadoDniEst === "Aprobado"&&
          estadoDniApo === "Aprobado"&&
          estadoLibreta === "Aprobado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            {
              estadoAdmision: "Aprobado",
              estadoProgramacion: "Programacion pendiente",
            },
            { new: true }
          );
        } else if (
          (estadoDniEst === "Rechazado"&&
          estadoDniApo === "Rechazado"&&
          estadoLibreta === "Rechazado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoAdmision: "Rechazado", estadoProgramacion: "Bloqueado" },
            { new: true }
          );
        } else {
          await Admision.findOneAndUpdate(
            { _id: id },
            {
              estadoAdmision: "Revisión pendiente",
              estadoProgramacion: "Bloqueado",
            },
            { new: true }
          );
        }
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarEstadoLibreta: async (_, { id, input }) => {
      try {
        const resultado = await Admision.findOneAndUpdate(
          { _id: id },
          { estadoLibreta: input },
          { new: true }
        );
        const { estadoDniEst, estadoDniApo, estadoLibreta } = resultado;
        if (
          (estadoDniEst === "Aprobado"&&
          estadoDniApo === "Aprobado"&&
          estadoLibreta === "Aprobado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            {
              estadoAdmision: "Aprobado",
              estadoProgramacion: "Programacion pendiente",
            },
            { new: true }
          );
        } else if (
          (estadoDniEst === "Rechazado"&&
          estadoDniApo === "Rechazado"&&
          estadoLibreta === "Rechazado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoAdmision: "Rechazado", estadoProgramacion: "Bloqueado" },
            { new: true }
          );
        } else {
          await Admision.findOneAndUpdate(
            { _id: id },
            {
              estadoAdmision: "Revisión pendiente",
              estadoProgramacion: "Bloqueado",
            },
            { new: true }
          );
        }
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarEstadoProgramacion: async (_, { id, input }) => {
      try {
        const resultado = await Admision.findOneAndUpdate(
          { _id: id },
          { estadoProgramacion: input },
          { new: true }
        );
        const { estadoProgramacion, estadoMatricula } = resultado;
        if (estadoProgramacion === "Aprobado") {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Pendiente" },
            { new: true }
          );
        }

        if (estadoProgramacion === "Rechazado") {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Bloqueado" },
            { new: true }
          );
        }
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarEstadoFirma: async (_, { id, input }) => {
      try {
        await Admision.findOneAndUpdate(
          { _id: id },
          { estadoFirma: input },
          { new: true }
        );
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },

    // Matricula
    actualizarEstadoMatricula: async (_, { id, input }) => {
      try {
        await Admision.findOneAndUpdate(
          { _id: id },
          { estadoMatricula: input },
          { new: true }
        );
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarFichaMatricula: async (_, { id, input }) => {
      try {
        const resultado = await Admision.findOneAndUpdate(
          { _id: id },
          { estadoFichaMatricula: input },
          { new: true }
        );

        const {
          estadoConstancia,
          estadoCertificado,
          estadoCertoNoAdeu,
          estadoLibreMatri,
          estadoComportamiento,
          estadoFichaMatricula,
          estadoCopiaDNI,
        } = resultado;

        if (
          (estadoFichaMatricula === "Aprobado"&&
          estadoConstancia === "Aprobado"&&
          estadoCertificado === "Aprobado"&&
          estadoCertoNoAdeu === "Aprobado"&&
          estadoLibreMatri === "Aprobado"&&
          estadoComportamiento === "Aprobado"&&
          estadoCopiaDNI === "Aprobado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Aprobado" },
            { new: true }
          );
        } else if (
          (estadoFichaMatricula === "Rechazado"&&
          estadoConstancia === "Rechazado"&&
          estadoCertificado === "Rechazado"&&
          estadoCertoNoAdeu === "Rechazado"&&
          estadoLibreMatri === "Rechazado"&&
          estadoComportamiento === "Rechazado"&&
          estadoCopiaDNI === "Rechazado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Rechazado" },
            { new: true }
          );
        } else {
          await Admision.findOneAndUpdate(
            { _id: id },
            {
              estadoMatricula: "Revisión pendiente",
            },
            { new: true }
          );
        }
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarConstanciaMatri: async (_, { id, input }) => {
      try {
        const resultado = await Admision.findOneAndUpdate(
          { _id: id },
          { estadoConstancia: input },
          { new: true }
        );
        const {
          estadoFichaMatricula,
          estadoConstancia,
          estadoCertificado,
          estadoCertoNoAdeu,
          estadoLibreMatri,
          estadoComportamiento,
          estadoCopiaDNI,
        } = resultado;

        if (
          (estadoFichaMatricula === "Aprobado"&&
          estadoConstancia === "Aprobado"&&
          estadoCertificado === "Aprobado"&&
          estadoCertoNoAdeu === "Aprobado"&&
          estadoLibreMatri === "Aprobado"&&
          estadoComportamiento === "Aprobado"&&
          estadoCopiaDNI === "Aprobado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Aprobado" },
            { new: true }
          );
        } else if (
          (estadoConstancia === "Rechazado"&&
          estadoFichaMatricula === "Rechaza&&o"&&
          estadoCertificado === "Rechazado"&&
          estadoCertoNoAdeu === "Rechazado"&&
          estadoLibreMatri === "Rechazado"&&
          estadoComportamiento === "Rechazado"&&
          estadoCopiaDNI === "Rechazado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Rechazado" },
            { new: true }
          );
        } else {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Revisión pendiente" },
            { new: true }
          );
        }

        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarCertificadoEstudios: async (_, { id, input }) => {
      try {
        const resultado = await Admision.findOneAndUpdate(
          { _id: id },
          { estadoLibreMatri: input },
          { new: true }
        );

        const {
          estadoFichaMatricula,
          estadoConstancia,
          estadoCertificado,
          estadoCertoNoAdeu,
          estadoLibreMatri,
          estadoComportamiento,
          estadoCopiaDNI,
        } = resultado;

        if (
          (estadoFichaMatricula === "Aprobado"&&
          estadoConstancia === "Aprobado"&&
          estadoCertificado === "Aprobado"&&
          estadoCertoNoAdeu === "Aprobado"&&
          estadoLibreMatri === "Aprobado"&&
          estadoComportamiento === "Aprobado"&&
          estadoCopiaDNI === "Aprobado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Aprobado" },
            { new: true }
          );
        } else if (
          (estadoConstancia === "Rechazado"&&
          estadoFichaMatricula === "Rechaza&&o"&&
          estadoCertificado === "Rechazado"&&
          estadoCertoNoAdeu === "Rechazado"&&
          estadoLibreMatri === "Rechazado"&&
          estadoComportamiento === "Rechazado"&&
          estadoCopiaDNI === "Rechazado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Rechazado" },
            { new: true }
          );
        } else {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Revisión pendiente" },
            { new: true }
          );
        }
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarConstNoAdeudo: async (_, { id, input }) => {
      try {
        const resultado = await Admision.findOneAndUpdate(
          { _id: id },
          { estadoCertoNoAdeu: input },
          { new: true }
        );
        const {
          estadoFichaMatricula,
          estadoConstancia,
          estadoCertificado,
          estadoCertoNoAdeu,
          estadoLibreMatri,
          estadoComportamiento,
          estadoCopiaDNI,
        } = resultado;

        if (
          (estadoFichaMatricula === "Aprobado"&&
          estadoConstancia === "Aprobado"&&
          estadoCertificado === "Aprobado"&&
          estadoCertoNoAdeu === "Aprobado"&&
          estadoLibreMatri === "Aprobado"&&
          estadoComportamiento === "Aprobado"&&
          estadoCopiaDNI === "Aprobado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Aprobado" },
            { new: true }
          );
        } else if (
          (estadoConstancia === "Rechazado"&&
          estadoFichaMatricula === "Rechaza&&o"&&
          estadoCertificado === "Rechazado"&&
          estadoCertoNoAdeu === "Rechazado"&&
          estadoLibreMatri === "Rechazado"&&
          estadoComportamiento === "Rechazado"&&
          estadoCopiaDNI === "Rechazado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Rechazado" },
            { new: true }
          );
        } else {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Revisión pendiente" },
            { new: true }
          );
        }
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarLibreEstudios: async (_, { id, input }) => {
      try {
        const resultado = await Admision.findOneAndUpdate(
          { _id: id },
          { estadoCertificado: input },
          { new: true }
        );
        const {
          estadoFichaMatricula,
          estadoConstancia,
          estadoCertificado,
          estadoCertoNoAdeu,
          estadoLibreMatri,
          estadoComportamiento,
          estadoCopiaDNI,
        } = resultado;

        if (
          (estadoFichaMatricula === "Aprobado"&&
          estadoConstancia === "Aprobado"&&
          estadoCertificado === "Aprobado"&&
          estadoCertoNoAdeu === "Aprobado"&&
          estadoLibreMatri === "Aprobado"&&
          estadoComportamiento === "Aprobado"&&
          estadoCopiaDNI === "Aprobado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Aprobado" },
            { new: true }
          );
        } else if (
          (estadoConstancia === "Rechazado"&&
          estadoFichaMatricula === "Rechazado"&&
          estadoCertificado === "Rechazado"&&
          estadoCertoNoAdeu === "Rechazado"&&
          estadoLibreMatri === "Rechazado"&&
          estadoComportamiento === "Rechazado"&&
          estadoCopiaDNI === "Rechazado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Rechazado" },
            { new: true }
          );
        } else {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Revisión pendiente" },
            { new: true }
          );
        }
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarLibretaComportamiento: async (_, { id, input }) => {
      try {
        const resultado = await Admision.findOneAndUpdate(
          { _id: id },
          { estadoComportamiento: input },
          { new: true }
        );
        const {
          estadoFichaMatricula,
          estadoConstancia,
          estadoCertificado,
          estadoCertoNoAdeu,
          estadoLibreMatri,
          estadoComportamiento,
          estadoCopiaDNI,
        } = resultado;

        if (
          (estadoFichaMatricula === "Aprobado"&&
          estadoConstancia === "Aprobado"&&
          estadoCertificado === "Aprobado"&&
          estadoCertoNoAdeu === "Aprobado"&&
          estadoLibreMatri === "Aprobado"&&
          estadoComportamiento === "Aprobado"&&
          estadoCopiaDNI === "Aprobado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Aprobado" },
            { new: true }
          );
        } else if (
          (estadoConstancia === "Rechazado"&&
          estadoFichaMatricula === "Rechazado"&&
          estadoCertificado === "Rechazado"&&
          estadoCertoNoAdeu === "Rechazado"&&
          estadoLibreMatri === "Rechazado"&&
          estadoComportamiento === "Rechazado"&&
          estadoCopiaDNI === "Rechazado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Rechazado" },
            { new: true }
          );
        } else {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Revisión pendiente" },
            { new: true }
          );
        }
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    actualizarConstTraslado: async (_, { id, input }) => {
      try {
        const resultado = await Admision.findOneAndUpdate(
          { _id: id },
          { estadoCopiaDNI: input },
          { new: true }
        );

        const {
          estadoFichaMatricula,
          estadoConstancia,
          estadoCertificado,
          estadoCertoNoAdeu,
          estadoLibreMatri,
          estadoComportamiento,
          estadoCopiaDNI,
        } = resultado;

        if (
          (estadoFichaMatricula === "Aprobado"&&
          estadoConstancia === "Aprobado"&&
          estadoCertificado === "Aprobado"&&
          estadoCertoNoAdeu === "Aprobado"&&
          estadoLibreMatri === "Aprobado"&&
          estadoComportamiento === "Aprobado"&&
          estadoCopiaDNI === "Aprobado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Aprobado" },
            { new: true }
          );
        } else if (
          (estadoConstancia === "Rechazado"&&
          estadoFichaMatricula === "Rechazado"&&
          estadoCertificado === "Rechazado"&&
          estadoCertoNoAdeu === "Rechazado"&&
          estadoLibreMatri === "Rechazado"&&
          estadoComportamiento === "Rechazado"&&
          estadoCopiaDNI === "Rechazado")
        ) {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Rechazado" },
            { new: true }
          );
        } else {
          await Admision.findOneAndUpdate(
            { _id: id },
            { estadoMatricula: "Revisión pendiente" },
            { new: true }
          );
        }
        return input;
      } catch (error) {
        throw new Error("Ocurrió un error");
      }
    },
    nuevoPago: async (_, { input }, ctx) => {
      const { token, id, nombre, idApoderado, apellido, monto, motivo } = input;
      console.log("asdsa", input);
      // const customer = await stripe.customers.create({
      //   id: idApoderado,
      //   description: `Matrícula por parte de ${id}  ${nombre} ${apellido}`,
      //   source: token.id
      // })

      const charge = stripe.charges.create({
        amount: monto * 100,
        currency: "pen",
        source: token.id,
        description: `Datos de usuario ${idApoderado} ${nombre} ${apellido}`
      })

      const pago = new Pago(input)

      const resultado = pago.save()
      return resultado
    }
  },
};

module.exports = resolvers;
