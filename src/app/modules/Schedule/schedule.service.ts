import { Prisma, Schedule, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { addHours, addMinutes, format } from "date-fns";
import { ISchedule, IScheduleFilterRequest } from "./schedule.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helper/pagination";
import { IAuthUser } from "../../interfaces/common";
import CustomApiError from "../../errors/customApiError";
import httpStatus from "http-status";

// const convertDateTime = async (date: Date) => {
//   const offset = date.getTimezoneOffset() * 60000;
//   return new Date(date.getTime() + offset);
// };

const createSchedule = async (payload: ISchedule): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, trainerId } = payload;

  if (!trainerId) {
    throw new CustomApiError(httpStatus.BAD_REQUEST, "Trainer ID is required!");
  }

  // Trainer existence check
  await prisma.user.findUniqueOrThrow({
    where: {
      id: trainerId,
      role: UserRole.TRAINER,
      status: UserStatus.ACTIVE,
    },
  });

  const schedules: Schedule[] = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    // Format day for display
    const formattedDate = format(currentDate, "yyyy-MM-dd");

    // Count existing schedules for the day
    const existingSchedulesCount = await prisma.schedule.count({
      where: {
        trainerId,
        startDateTime: {
          gte: new Date(`${formattedDate}T00:00:00.000Z`),
          lt: new Date(`${formattedDate}T23:59:59.999Z`),
        },
      },
    });

    if (existingSchedulesCount >= 5) {
      throw new CustomApiError(
        httpStatus.BAD_REQUEST,
        `Cannot create more than 5 schedules on ${formattedDate}`
      );
    }

    // Build start & end time
    const [hour, minute] = startTime.split(":").map(Number);
    const startDateTime = new Date(currentDate);
    startDateTime.setHours(hour, minute, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 2);

    // Check for time overlap
    const overlapSchedule = await prisma.schedule.findFirst({
      where: {
        trainerId,
        startDateTime: { lt: endDateTime },
        endDateTime: { gt: startDateTime },
      },
    });

    if (overlapSchedule) {
      throw new CustomApiError(
        httpStatus.CONFLICT,
        `Schedule conflict detected on ${formattedDate} from ${startTime}.`
      );
    }

    // Create schedule if no overlap
    const createdSchedule = await prisma.schedule.create({
      data: {
        trainerId,
        startDateTime,
        endDateTime,
      },
    });

    schedules.push(createdSchedule);

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const getTrainerSchedules = async (user: IAuthUser): Promise<Schedule[]> => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      role: UserRole.TRAINER,
    },
  });

  const schedules = await prisma.schedule.findMany({
    where: {
      trainerId: userData.id,
    },
    orderBy: {
      startDateTime: "asc",
    },
  });

  return schedules;
};

const getAllSchedules = async (filters: {
  date?: string;
  trainerId?: string;
}): Promise<Schedule[]> => {
  const conditions: any = {};

  if (filters.date) {
    const startOfDay = new Date(`${filters.date}T00:00:00.000Z`);
    const endOfDay = new Date(`${filters.date}T23:59:59.999Z`);
    conditions.startDateTime = {
      gte: startOfDay,
      lt: endOfDay,
    };
  }

  if (filters.trainerId) {
    conditions.trainerId = filters.trainerId;
  }

  const schedules = await prisma.schedule.findMany({
    where: conditions,
    orderBy: {
      startDateTime: "asc",
    },
  });

  return schedules;
};

const getSingleScheduleById = async (id: string): Promise<Schedule | null> => {
  const result = await prisma.schedule.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  return result;
};

const deleteScheduleById = async (id: string): Promise<Schedule> => {
  const result = await prisma.schedule.delete({
    where: {
      id: id,
    },
  });
  //console.log(result?.startDateTime.getHours() + ":" + result?.startDateTime.getMinutes())
  //console.log(result?.startDateTime.getUTCHours() + ":" + result?.startDateTime.getUTCMinutes())
  return result;
};

export const ScheduleService = {
  createSchedule,
  getTrainerSchedules,
  getAllSchedules,
  getSingleScheduleById,
  deleteScheduleById,
};
