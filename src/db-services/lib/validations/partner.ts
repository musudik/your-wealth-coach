import * as z from "zod";

export const partnerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  
  email: z.string()
    .email("Invalid email address"),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  
  location: z.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),
  
  description: z.string()
    .min(50, "Description must be at least 50 characters")
    .max(2500, "Description must be less than 2500 characters"),
  
  experience: z.string()
    .min(1, "Experience is required"),
  
  certificates: z.number()
    .int()
    .min(0, "Certificates cannot be negative")
    .max(100, "Too many certificates"),
  
  internships: z.number()
    .int()
    .min(0, "Internships cannot be negative")
    .max(100, "Too many internships"),
  
  photoUrl: z.string()
    .regex(/^data:image\/(jpeg|png|gif|webp);base64,/, "Invalid image format")
    .optional(),
  
  achievements: z.array(
    z.string()
      .min(3, "Achievement must be at least 3 characters")
      .max(200, "Achievement must be less than 200 characters")
  ),
  
  specializations: z.array(
    z.string()
      .min(3, "Specialization must be at least 3 characters")
      .max(100, "Specialization must be less than 100 characters")
  ),
  
  education: z.array(
    z.object({
      degree: z.string()
        .min(2, "Degree must be at least 2 characters")
        .max(100, "Degree must be less than 100 characters"),
      institution: z.string()
        .min(2, "Institution must be at least 2 characters")
        .max(100, "Institution must be less than 100 characters"),
      year: z.string()
        .regex(/^\d{4}$/, "Invalid year format")
    })
  ),
  
  socialLinks: z.object({
    linkedin: z.string()
      .url("Invalid LinkedIn URL")
      .optional()
      .or(z.literal("")),
    twitter: z.string()
      .url("Invalid Twitter URL")
      .optional()
      .or(z.literal("")),
    website: z.string()
      .url("Invalid Website URL")
      .optional()
      .or(z.literal(""))
  })
});

export type PartnerFormData = z.infer<typeof partnerSchema>; 