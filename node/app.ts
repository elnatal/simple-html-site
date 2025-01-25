import express from "express";
import routes from "./routes";
import cors from 'cors';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));

app.use("/", routes);

export default app;