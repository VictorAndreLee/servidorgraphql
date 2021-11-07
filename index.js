const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const jwt = require("jsonwebtoken");
// const cors = require("cors");

const conectarDB = require("./config/db");
const { bootstrap: bootstrapGlobalAgent } = require("global-agent");

const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require("graphql-upload");


require("dotenv").config({ path: "variables.env" });

conectarDB();

bootstrapGlobalAgent();

// const corsOptions = {
//   origin: process.env.PAGINA,
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//   credentials: true
// }

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    cors: {
      credentials: true,
      origin: process.env.PAGINA,
      optionsSuccessStatus: 200,
    },
    context: ({ req, res }) => {
      // // console.log(req.headers['authorization']);
      const token = req.headers["authorization"] || "";
      // console.log("headers", req.headers);
      if (token) {
        try {
          const usuario = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.SECRETA
          );
          console.log(usuario);
          return {
            usuario,
          };
        } catch (error) {
          console.log("HUBO UN ERROR");
          console.log(error.message);
          // res.setHeader('Response URL', `${process.env.PAGINA}`)
        }
      }
    },
  });

  await server.start();

  const app = express();
  try {
    // app.use(cors(corsOptions))
    app.use(graphqlUploadExpress());
    app.use(express.static('jM9n1nH31KaYqF2Gzc'));
    server.applyMiddleware({ app });
    app.use(express.urlencoded({ extended: false }));
    
    app.use(express.json());
    app.use(graphqlUploadExpress());
    app.use(express.static("jM9n1nH31KaYqF2Gzc"));
    
    app.all("/pdf", async (req, res) => {
      const email = req.query.email;
      
      const base64 = JSON.stringify(req.body.base64, null, 2);
      
      EmailSender(email, base64);
      
      res.send("[about : black]");
    });

    // Arrancar el servidor
    app.listen({ port: process.env.PORT || 4000 }, () => {
      console.log(
        `Servidor corriendo http://localhost:${process.env.PORT || 4000}${
          server.graphqlPath
        }`
      );
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();