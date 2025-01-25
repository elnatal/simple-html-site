import { Router } from "express";
import { index } from "../controllers/comment";

const commentRoutes: Router = Router();

commentRoutes.get("/", index);

export default commentRoutes;