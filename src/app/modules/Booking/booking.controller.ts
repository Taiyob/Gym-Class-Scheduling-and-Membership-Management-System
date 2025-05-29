import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { BookingService } from "./booking.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";

const bookClass = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await BookingService.bookSchedule(
      user as IAuthUser,
      req.body.scheduleId
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Class booked successfully!",
      data: result,
    });
  }
);

const getMyUpcomingBookings = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await BookingService.getUpcomingBookings(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Upcoming bookings fetched successfully",
      data: result,
    });
  }
);

export const BookingController = { bookClass, getMyUpcomingBookings };
