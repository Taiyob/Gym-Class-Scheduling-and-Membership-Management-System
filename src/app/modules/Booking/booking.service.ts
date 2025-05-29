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
      "This class is full. Maximum 10 bookings allowed."
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

export const BookingService = { bookSchedule, getUpcomingBookings };
