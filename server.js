import express from "express";
import pkg from "body-parser";
import routes from "./routes.js";
import dotenv from "dotenv";
import proxy from "./proxy.js";

dotenv.config();

const { json } = pkg;

const app = express();
const PORT = process.env.GATEWAY_PORT;

app.use(json());

app.use("/api/movies", proxy);
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`API Gateway server listening on port ${PORT}`);
});
