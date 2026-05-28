import type { z } from "zod";
import type {
  personSchema,
  createPersonSchema,
  updatePersonSchema,
} from "../schemas/person.schema";

export type Person = z.infer<typeof personSchema> & {
  id: string;
  organization_id: string;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
};

export type CreatePersonPayload = z.infer<typeof createPersonSchema>;
export type UpdatePersonPayload = z.infer<typeof updatePersonSchema>;

export interface PersonFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}
