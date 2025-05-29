import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { BookingController } from "./booking.controller";

const route = express.Router();

route.post("/book", auth(UserRole.TRAINEE), BookingController.bookClass);

route.get(
  "/my-bookings",
  auth(UserRole.TRAINEE),
  BookingController.getMyUpcomingBookings
);

export const BookingRoute = route;
