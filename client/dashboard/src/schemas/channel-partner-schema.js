import { z } from "zod";

export const channelPartnerSchema = z.object({
  country: z.string().min(1, "Country is required"),
  iso: z.string().optional(),
  region: z.string().optional(),
  company: z.string().min(1, "Company is required"),
  address: z.any().optional(),
  contact_person: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  website: z.string().optional(),
  logo: z.any().optional(),
  description: z.string().optional(),
});
