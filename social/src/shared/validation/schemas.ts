import { z } from 'zod';

/**
 * Authentication Form Schemas
 */
export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(3, 'Username or Email must be at least 3 characters')
    .max(100, 'Too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[0-9]/, 'Must include at least one number'),
  rememberMe: z.boolean().default(true),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9._]+$/, 'Username can only contain letters, numbers, dots, and underscores'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least 1 uppercase letter')
      .regex(/[0-9]/, 'Must contain at least 1 number'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to terms & privacy policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Post & Poll Creation Schemas
 */
export const createPostSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty').max(3000, 'Character limit exceeded (3000 max)'),
  privacy: z.enum(['public', 'friends', 'private']).default('public'),
  location: z.string().optional(),
  feeling: z.string().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

export const createPollSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(200),
  options: z
    .array(
      z.object({
        text: z.string().min(1, 'Option text cannot be empty').max(60),
      })
    )
    .min(2, 'Poll must have at least 2 options')
    .max(6, 'Maximum 6 options allowed'),
  durationDays: z.number().min(1).max(7).default(1),
});

export type CreatePollFormData = z.infer<typeof createPollSchema>;

/**
 * Profile Editing Schema
 */
export const editProfileSchema = z.object({
  name: z.string().min(2).max(50),
  headline: z.string().max(100).optional(),
  bio: z.string().max(250).optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  location: z.string().max(60).optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;

/**
 * Marketplace Product Listing Schema
 */
export const marketplaceListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  price: z.number().positive('Price must be greater than $0'),
  category: z.enum(['electronics', 'vehicles', 'apparel', 'furniture', 'services', 'other']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  location: z.string().min(2, 'Location is required'),
  condition: z.enum(['new', 'like_new', 'good', 'fair']),
});

export type MarketplaceListingFormData = z.infer<typeof marketplaceListingSchema>;

/**
 * Comment Form Schema
 */
export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
  parentId: z.string().optional(),
});

export type CommentFormData = z.infer<typeof commentSchema>;
