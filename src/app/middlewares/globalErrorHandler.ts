import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import CustomApiError from "../errors/customApiError";
import { ZodError } from "zod";

// const globalErrorHandler = (
//   error: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
//   let message = error?.message || "Something went wrong";
//   let errorDetails: any = error;

//   // Handle CustomApiError
//   if (error instanceof CustomApiError) {
//     statusCode = error.statusCode;
//     message = error.message;
//     errorDetails = error.errorDetails || error.stack || error.message;
//   }

//   // Zod validation error (frontend/backend)
//   else if (error instanceof ZodError) {
//     statusCode = httpStatus.BAD_REQUEST;
//     message = "Validation error occurred.";
//     errorDetails = error.errors.map((err) => ({
//       field: err.path[0],
//       message: err.message,
//     }));
//   }

//   // Prisma Validation Error
//   else if (error instanceof Prisma.PrismaClientValidationError) {
//     statusCode = httpStatus.BAD_REQUEST;
//     message = "Validation error occurred.";
//     errorDetails = {
//       message: error.message,
//     };
//   }

//   // Prisma Unique Constraint Violation
//   else if (error instanceof Prisma.PrismaClientKnownRequestError) {
//     if (error.code === "P2002") {
//       statusCode = httpStatus.CONFLICT;
//       message = "Duplicate key error.";
//       errorDetails = error.meta;
//     }
//   }

//   res.status(statusCode).json({
//     success: false,
//     message,
//     errorDetails,
//   });
// };
const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = error?.message || "Something went wrong";
  let errorDetails: any = undefined; // Start clean

  // Handle CustomApiError
  if (error instanceof CustomApiError) {
    statusCode = error.statusCode;
    message = error.message;

    // Only include errorDetails if explicitly provided
    if (error.errorDetails) {
      errorDetails = error.errorDetails;
    }
  }

  // Zod validation error
  else if (error instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation error occurred.";
    errorDetails = error.errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
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

  const response: Record<string, any> = {
    success: false,
    message,
  };

  // Only include errorDetails if it's defined (cleaner output)
  if (errorDetails !== undefined) {
    response.errorDetails = errorDetails;
  }

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
