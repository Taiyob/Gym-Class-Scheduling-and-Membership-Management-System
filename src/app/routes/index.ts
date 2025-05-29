import express from "express";
import { userRoute } from "../modules/User/user.route";
import { AuthRoute } from "../modules/Auth/auth.route";
import { ScheduleRoute } from "../modules/Schedule/schedule.route";

const route = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/schedule",
    route: ScheduleRoute,
  },
];

moduleRoutes.forEach((router) => route.use(router.path, router.route));

export default route;
