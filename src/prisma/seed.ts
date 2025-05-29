import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../shared/prisma";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
      },
    });

    if (isExistSuperAdmin) {
      console.log("Admin Already Exist");
      return;
    }

    const password = await bcrypt.hash("superadmin", 12);

    const superAdminData = await prisma.user.create({
      data: {
        email: "super@admin.com",
        password: password,
        role: UserRole.ADMIN,
        profile: {
          create: {
            name: "Mr Admin",
          },
        },
      },
    });

    console.log("admin created successfully", superAdminData);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
