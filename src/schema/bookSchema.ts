import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1).max(255),
  avatar: z.string().url(),
  genre: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  publishedDate: z.string(),
});

export const updateBookSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  avatar: z.string().url().optional(),
  genre: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(255).optional(),
  publishedDate: z.string().optional(),
});
