import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../helper/jsonWebToken";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import CustomApiError from "../errors/customApiError";
import httpStatus from "http-status";

const auth = (...role: string[]) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new CustomApiError(
          httpStatus.UNAUTHORIZED,
          "Unauthorized access.",
          "You must be logged in to access this route."
        );
      }

      const decodedTokenInfo = verifyToken(
        token,
        config.jwt.access_secret as Secret
      );
      req.user = decodedTokenInfo;

      if (role.length && !role.includes(decodedTokenInfo.role)) {
        throw new CustomApiError(
          httpStatus.FORBIDDEN,
          "Unauthorized access.",
          `You must be a ${role.join(" or ")} to perform this action.`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
