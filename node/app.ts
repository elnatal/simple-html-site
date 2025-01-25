import express from "express";
import { Comment } from "./models/comment";
import routes from "./routes";

const app = express();

// setup cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", routes);

export default app;