import dotenv from "dotenv";
import express from "express";
import * as routes from "./routes";
import bodyParser from "body-parser";

// initialize configuration
dotenv.config();

//"main": "dist/index.js",

const port = process.env.SERVER_PORT;

const app = express();

// tslint:disable-next-line: deprecation
app.use(bodyParser.json());

//routes
routes.register(app);

// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
