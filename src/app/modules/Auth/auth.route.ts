import express from "express";
import { AuthController } from "./auth.controller";

const route = express.Router();

route.post("/login", AuthController.loginUserFromDB);

route.post("/logout", AuthController.logoutUser);

export const AuthRoute = route;
