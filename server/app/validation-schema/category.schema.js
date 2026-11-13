import { z } from "zod";

const faqSchema = z
  .array(
    z.object({
      q: z.string().trim().min(3, "Question must be at least 3 characters long."),
      a: z.string().trim().min(3, "Answer must be at least 3 characters long."),
    }),
  )
  .optional()
  .nullable();

// content of one site (or one language version of it); all optional —
// an empty field uses the category's base value
const contentSchema = z.object({
  title: z.string().optional().nullable(),
  h1: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  meta_keywords: z.string().optional().nullable(),
  jsonld_schema: z.any().optional(),
  faq: faqSchema,
});

const countryTabSchema = contentSchema.extend({
  // language versions: { fr: {...}, hi: {...} } (ISO 639-1 codes)
  translations: z
    .record(z.string().regex(/^[a-z]{2,3}$/, "Invalid language code"), contentSchema)
    .optional(),
});

export const categorySchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  featured: z.boolean().optional().default(false),
  status: z.enum(["active", "draft"]).optional(),
  // sites with a category page ("Global" + countries)
  city: z.array(z.string()).optional(),
  country_content: z.record(z.string(), countryTabSchema).optional(),
  h1: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  meta_keywords: z.string().optional().nullable(),
  jsonld_schema: z.any().optional(),
  faq: faqSchema,
});
