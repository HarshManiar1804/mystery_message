import { z } from "zod";
export const usernameSchema = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(20, "Username must be no more then 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username must only contain letters, numbers and underscores"
  );

export const emailValidation = z
  .string()
  .email({ message: "Invalid email address" });

export const passwordValidation = z
  .string()
  .min(6, "Password must be atleast 6 characters");

export const signUpSchema = z.object({
  username: usernameSchema,
  email: emailValidation,
  password: passwordValidation,
});
