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

route.delete(
  "/:bookingId",
  auth(UserRole.TRAINEE),
  BookingController.cancelBooking
);

export const BookingRoute = route;
