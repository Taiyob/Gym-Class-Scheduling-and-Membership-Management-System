import express from "express";
import { UserControllers } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const route = express.Router();

route.post(
  "/create",
  validateRequest(UserValidation.createUser),
  UserControllers.createUserIntoDB
);

route.post(
  "/create/trainer",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidation.createUser),
  UserControllers.createTrainerIntoDB
);

route.get(
  "/me",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.TRAINEE,
    UserRole.TRAINER
  ),
  UserControllers.getMyProfileFromDB
);

route.get(
  "/all-users",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserControllers.getAllUserFromDB
);

route.patch(
  "/update-my-profile",
  auth(UserRole.TRAINEE),
  UserControllers.updateMyProfileIntoDB
);

export const userRoute = route;
