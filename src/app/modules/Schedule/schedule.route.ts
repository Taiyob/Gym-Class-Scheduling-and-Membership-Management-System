import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const route = express.Router();

route.post(
  "/create",
  auth(UserRole.ADMIN),
  ScheduleController.createScheduleIntoDB
);

export const ScheduleRoute = route;
