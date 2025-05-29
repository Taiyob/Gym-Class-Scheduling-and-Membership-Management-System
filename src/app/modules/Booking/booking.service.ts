import { Booking, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import CustomApiError from "../../errors/customApiError";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";

const bookSchedule = async (
  user: IAuthUser,
  scheduleId: string
): Promise<Booking> => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      role: UserRole.TRAINEE,
    },
  });

  if (!scheduleId) {
    throw new CustomApiError(
      httpStatus.BAD_REQUEST,
      "Schedule ID is required."
    );
  }

  // Check if schedule exists
  const schedule = await prisma.schedule.findUniqueOrThrow({
    where: { id: scheduleId },
  });

  // Count existing bookings for this schedule
  const bookingCount = await prisma.booking.count({
    where: { scheduleId },
  });

  if (bookingCount >= 10) {
    throw new CustomApiError(
      httpStatus.BAD_REQUEST,
      "Class schedule is full. Maximum 10 trainees allowed per schedule."
    );
  }

  // Prevent overlapping booking for same user
  const overlap = await prisma.booking.findFirst({
    where: {
      userId: userData.id,
      schedule: {
        startDateTime: { lt: schedule.endDateTime },
        endDateTime: { gt: schedule.startDateTime },
      },
    },
  });

  if (overlap) {
    throw new CustomApiError(
      httpStatus.CONFLICT,
      "You already have a booking in this time slot."
    );
  }

  // Create booking
  const newBooking = await prisma.booking.create({
    data: {
      userId: userData.id,
      scheduleId,
    },
  });

  return newBooking;
};

const getUpcomingBookings = async (user: IAuthUser): Promise<Booking[]> => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      role: UserRole.TRAINEE,
    },
  });

  const bookings = await prisma.booking.findMany({
    where: {
      userId: userData.id,
      schedule: {
        startDateTime: {
          gt: new Date(),
        },
      },
    },
    include: {
      schedule: true,
    },
    orderBy: {
      schedule: {
        startDateTime: "asc",
      },
    },
  });

  return bookings;
};

const cancelBooking = async (
  user: IAuthUser,
  bookingId: string
): Promise<Booking> => {
  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { schedule: true },
  });

  if (!existingBooking) {
    throw new CustomApiError(httpStatus.NOT_FOUND, "Booking not found.");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  if (existingBooking.userId !== userData.id) {
    throw new CustomApiError(
      httpStatus.FORBIDDEN,
      "Unauthorized to cancel this booking."
    );
  }

  if (new Date(existingBooking.schedule.startDateTime) <= new Date()) {
    throw new CustomApiError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel a class that has already started."
    );
  }

  const cancelledBooking = await prisma.booking.delete({
    where: { id: bookingId },
  });

  return cancelledBooking;
};

export const BookingService = {
  bookSchedule,
  getUpcomingBookings,
  cancelBooking,
};
