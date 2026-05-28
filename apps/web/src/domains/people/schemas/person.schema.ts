import { z } from "zod";

export const personSchema = z.object({
  first_name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  last_name: z
    .string()
    .min(1, "El apellido es requerido")
    .max(100, "El apellido no puede exceder 100 caracteres"),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .optional()
    .or(z.literal("")),
});

export const createPersonSchema = personSchema.extend({
  organization_id: z.string().min(1, "La organización es requerida"),
});

export const updatePersonSchema = personSchema.partial().extend({
  id: z.string().min(1, "El ID es requerido"),
  status: z.enum(["active", "archived"]).optional(),
});

export type PersonInput = z.infer<typeof personSchema>;
export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;