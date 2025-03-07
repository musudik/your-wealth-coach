import { z } from "zod";
import languageData from "./i18n/language.json";

export const electricityFormSchema = z.object({
  firstName: z.string().min(1, languageData.de.required),
  lastName: z.string().min(1, languageData.de.required),
  email: z.string()
    .min(1, languageData.de.required)
    .email(languageData.de.invalidEmail),
  mobile: z.string()
    .min(1, languageData.de.required)
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, languageData.de.invalidMobile),
  address: z.string().min(1, languageData.de.required),
  currentContract: z.string().optional(),
  numberOfPersons: z.string()
    .min(1, languageData.de.required)
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: languageData.de.invalidNumber
    }),
  consumption: z.string()
    .min(1, languageData.de.required)
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: languageData.de.invalidConsumption
    }),
  signature: z.object({
    place: z.string().min(1, languageData.de.placeRequired),
    date: z.string().min(1, languageData.de.dateRequired),
    signatureData: z.string().min(1, languageData.de.signatureRequired),
    referredBy: z.string().optional()
  })
});

export type ElectricityFormData = z.infer<typeof electricityFormSchema>; 