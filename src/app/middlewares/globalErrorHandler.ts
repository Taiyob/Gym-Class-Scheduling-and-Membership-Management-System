import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import CustomApiError from "../errors/customApiError";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = error?.message || "Something went wrong";
  let errorDetails: any = error;

  // Handle CustomApiError
  if (error instanceof CustomApiError) {
    statusCode = error.statusCode;
    errorDetails = error.stack || error.message;
  }

  // Prisma Validation Error
  else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation error occurred.";
    errorDetails = {
      message: error.message,
    };
  }

  // Prisma Unique Constraint Violation
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      message = "Duplicate key error.";
      errorDetails = error.meta;
    }
  }

  // Final structured response
  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;
