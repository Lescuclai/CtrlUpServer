import {} from "dotenv/config";

import express from "express";
import session from "express-session";
import router from "/Users/leaescudie/Desktop/Workspace/Perso_test/CtrlUpServer/app/router.js";
import cors from "cors";
import bodyParser from "body-parser";
import schema from "/Users/leaescudie/Desktop/Workspace/Perso_test/CtrlUpServer/app/db/schema.js";
import "/Users/leaescudie/Desktop/Workspace/Perso_test/CtrlUpServer/app/db/client.js";
import { graphqlHTTP } from "express-graphql";

// import userMiddleware from "/Users/leaescudie/Desktop/Workspace/Perso_test/CtrlUpServer/app/middlewares/user.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccesStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.options("*", cors());

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));
app.use("/public", express.static("public"));

app.use(
  session({
    secret: "keyboard-cat",
    resave: true,
    saveUninitialized: true,
  })
);

// app.use(userMiddleware);

app.use(router);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT} ...`);
});
