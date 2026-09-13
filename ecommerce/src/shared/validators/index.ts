import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email or phone number is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(6, "Phone number is required"),
  addressLine1: z.string().min(5, "Street address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  type: z.enum(["HOME", "WORK", "OTHER"]),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, "Review title is required"),
  comment: z.string().min(10, "Review comment must be at least 10 characters"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
