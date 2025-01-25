import { Router } from "express";
import commentRoutes from "./comment";

const rootRouter: Router = Router();

rootRouter.use("/comments", commentRoutes);

export default rootRouter;
