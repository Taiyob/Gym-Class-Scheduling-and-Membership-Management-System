import { UserStatus } from "@prisma/client";
import { createToken } from "../../../helper/jsonWebToken";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";

const loginUser = async (payLoad: { email: string; password: string }) => {
  const existUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: payLoad.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordMatch: boolean = await bcrypt.compare(
    payLoad.password,
    existUser.password
  );

  if (!isPasswordMatch) {
    throw new Error("Password is incorrect, please give correct passrord!!!");
  }

  const accessToken = createToken(
    existUser.email,
    existUser.role,
    process.env.ACCESS_SECRET as string,
    900000
  );

  const refreshToken = createToken(
    existUser.email,
    existUser.role,
    process.env.REFRESH_SECRET as string,
    172800000
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    needPasswordChange: existUser.needPasswordChange,
  };
};

const logoutUser = async (): Promise<void> => {
  // Future logic jemon token blacklist, logging etc. ekhane handle hobe
  return;
};

export const AuthService = {
  loginUser,
  logoutUser,
};
