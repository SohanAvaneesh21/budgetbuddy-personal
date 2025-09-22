import { Router } from "express";
import {
  generateReportController,
  getAllReportsController,
  updateReportSettingController,
  emailReportController,
} from "../controllers/report.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const reportRouter = Router();

reportRouter.get("/generate", passportAuthenticateJwt, generateReportController);
reportRouter.post("/email", passportAuthenticateJwt, emailReportController);
reportRouter.get("/", passportAuthenticateJwt, getAllReportsController);
reportRouter.put("/settings", passportAuthenticateJwt, updateReportSettingController);

export default reportRouter;
