import express from "express";
import pkg from "body-parser";
import routes from "./routes.js";

const { json } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`API Gateway server listening on port ${PORT}`);
});
