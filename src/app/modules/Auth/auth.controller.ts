import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";

const loginUserFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  const { refreshToken } = result;

  // Production e secure: true hobe, development purpose e false kore rakha hoise
  res.cookie("refreshToken", refreshToken, { secure: false, httpOnly: true });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!!!",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  await AuthService.logoutUser();

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false, // production e true hobe
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully!",
    data: null,
  });
});

export const AuthController = {
  loginUserFromDB,
  logoutUser,
};
