import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helper/pagination";
import { userSearchableFileds } from "./user.constant";
import CustomApiError from "../../errors/customApiError";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";

const createUser = async (payload: any): Promise<User> => {
  const email = payload.email;
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new CustomApiError(
      httpStatus.CONFLICT,
      "User with this email already exists!"
    );
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: email,
    password: hashedPassword,
    role: UserRole.TRAINEE,
  };

  const result = await prisma.$transaction(async (txClient) => {
    const newUser = await txClient.user.create({
      data: userData,
    });

    const profileData = {
      userId: newUser.id,
      name: payload.profile.name,
      age: payload.profile.age,
      phone: payload.profile.phone,
      gender: payload.profile.gender,
    };

    await txClient.profile.create({
      data: profileData,
    });

    return newUser;
  });

  const responseData = await prisma.user.findUniqueOrThrow({
    where: {
      email: result.email,
    },
    include: {
      profile: true,
    },
  });

  return responseData;
};

const createTrainer = async (payload: any): Promise<User> => {
  const email = payload.email;
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new CustomApiError(
      httpStatus.CONFLICT,
      "User with this email already exists!"
    );
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: email,
    password: hashedPassword,
    role: UserRole.TRAINER,
  };

  const result = await prisma.$transaction(async (txClient) => {
    const newUser = await txClient.user.create({
      data: userData,
    });

    const profileData = {
      userId: newUser.id,
      name: payload.profile.name,
      age: payload.profile.age,
      phone: payload.profile.phone,
      gender: payload.profile.gender,
    };

    await txClient.profile.create({
      data: profileData,
    });

    return newUser;
  });

  const responseData = await prisma.user.findUniqueOrThrow({
    where: {
      email: result.email,
    },
    include: {
      profile: true,
    },
  });

  return responseData;
};

const getAllUser = async (params: any, options: IPaginationOptions) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchableFileds.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //console.dir(andConditions, { depth: Infinity });
  if (Object.keys(filterData).length > 0) {
    console.dir(Object.keys(filterData), { depth: Infinity });

    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        // Debugging logs
        console.log("Filter Data:", filterData);
        console.log("Accessing key:", key, "Value:", (filterData as any)[key]);

        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateUserStatus = async (id: string, data: { status: UserStatus }) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      status: data.status,
    },
  });

  return result;
};

const getMyProfile = async (user: IAuthUser) => {
  const myprofileInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
      profile: {
        select: {
          name: true,
          age: true,
          phone: true,
          gender: true,
        },
      },
    },
  });

  return myprofileInfo;
};

const updateMyProfile = async (
  user: IAuthUser,
  payload: any
): Promise<User> => {
  const { profile, ...userData } = payload;

  const existingUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      profile: true,
    },
  });

  const result = await prisma.$transaction(async (txClient) => {
    const { email, role, password, ...safeUserData } = userData;

    const updateUserData = await txClient.user.update({
      where: { email: existingUser.email },
      data: safeUserData,
    });

    const profileUpdatePayload = {
      name: payload.profile.name ?? existingUser.profile?.name,
      age: payload.profile.age ?? existingUser.profile?.age,
      phone: payload.profile.phone ?? existingUser.profile?.phone,
      gender: payload.profile.gender ?? existingUser.profile?.gender,
    };

    await txClient.profile.update({
      where: {
        userId: updateUserData.id,
      },
      data: profileUpdatePayload,
    });

    const updatedUser = await txClient.user.findUniqueOrThrow({
      where: { email: user?.email },
      include: {
        profile: true,
      },
    });

    return updatedUser;
  });

  return result;
};

export const UserService = {
  createUser,
  createTrainer,
  getAllUser,
  updateUserStatus,
  getMyProfile,
  updateMyProfile,
};
