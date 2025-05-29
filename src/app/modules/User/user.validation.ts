import { z } from "zod";

const createUser = z.object({
  email: z
    .string({ required_error: "email must be set" })
    .email({ message: "Invalid email format." }),
  password: z.string({ required_error: "Password must be set" }),
  profile: z.object({
    name: z.string({ required_error: "Name is required" }),
    age: z.number().optional(),
    phone: z.string().optional(),
    gender: z.enum(["Male", "Female"]).optional(),
  }),
});

export const UserValidation = { createUser };
