import { z } from "zod";

export const ProductFormSchema = z.object({
  title: z.string().min(1, "Title is required"),

  price: z.coerce
    .number({ message: "Enter valid price." })
    .min(1, { message: "Price required." }),

  description: z.string().optional(),

  min_age: z.number().int().nonnegative(),

  category_id: z.string().optional(),

  city: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .default([]),

  features: z
    .array(
      z.object({
        image: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .default([]),

  youtube_urls: z
    .array(
      z.object({
        url: z.union([z.null(), z.string().url()]),
      }),
    )
    .transform((data) => data.map((d) => d.url).filter((url) => url !== null))
    .default([])
    .optional(),

  specifications: z
    .array(
      z.object({
        title: z.string().min(1, { message: "Required*" }),
        description: z.string().min(1, { message: "Required*" }),
      }),
    )
    .default([]),

  content: z.string().nullable().optional(),

  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
});
