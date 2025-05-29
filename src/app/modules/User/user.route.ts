import express from "express";
import { UserControllers } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const route = express.Router();

route.post(
  "/create",
  validateRequest(UserValidation.createUser),
  UserControllers.createUserIntoDB
);

export const userRoute = route;
