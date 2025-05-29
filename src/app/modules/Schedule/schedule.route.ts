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

route.get(
  "/my-schedules",
  auth(UserRole.TRAINER),
  ScheduleController.getMySchedules
);

route.get("/", auth(UserRole.ADMIN), ScheduleController.getAllSchedules);

export const ScheduleRoute = route;
