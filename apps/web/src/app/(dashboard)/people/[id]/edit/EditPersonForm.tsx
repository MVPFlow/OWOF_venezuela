"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PersonForm } from "@/domains/people/components/PersonForm";
import { updatePerson } from "@/domains/people/actions/updatePerson";
import type { Person } from "@/domains/people/types";
import type { PersonInput } from "@/domains/people/schemas/person.schema";

interface EditPersonFormProps {
  person: Person;
}

export function EditPersonForm({ person }: EditPersonFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PersonInput) => {
    setIsSubmitting(true);
    setError(null);

    const result = await updatePerson({
      ...data,
      id: person.id,
    });

    if (!result.success) {
      const errorMessages = Object.values(result.error).flat();
      setError(errorMessages[0] ?? "Error al actualizar la persona");
      setIsSubmitting(false);
      return;
    }

    // Redirect is handled by the server action
    router.push("/dashboard/people");
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <PersonForm
        initialData={person}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}