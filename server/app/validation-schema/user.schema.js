import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  // mobile_number: z.string().min(10, "Please enter a valid mobile number"),
  mobile_number: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role: z.string().default("user"),
  // password: z.string().min(8, "Password must be at least 8 characters"),
  password: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

export const registerVerifySchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  mobile_number: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role: z.string().default("user"),
  password: z.string(),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  request_id: z.string().uuid(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^\S+$/, "Username cannot contain spaces")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 4 characters"),
  fullname: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  mobile_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid mobile number")
    .optional(),
});
