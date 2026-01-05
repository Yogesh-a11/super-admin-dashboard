import { Router } from "express";
import { getDashboardData } from "../Controllers/companyController.js";

const companyRouter = Router();

companyRouter.get("/dashboard", getDashboardData);

export default companyRouter;