import express from "express";
import { ScheduleController } from "./schedule.controller";

const route = express.Router();

route.post("/", ScheduleController.createScheduleIntoDB);

export const ScheduleRoute = route;
