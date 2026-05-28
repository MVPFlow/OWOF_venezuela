import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditPersonForm } from "./EditPersonForm";
import type { Person } from "@/domains/people/types";

export const metadata = {
  title: "Editar Persona",
  description: "Formulario para editar una persona",
};

interface EditPersonPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPersonPage({ params }: EditPersonPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Get the person
  const { data: person, error } = await supabase
    .from("people")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !person) {
    return notFound();
  }

  // Verify the person belongs to the user's organization
  const { data: userData } = await supabase
    .from("users")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  const personData = person as unknown as {
    first_name: string;
    last_name: string;
    organization_id: string;
  };
  const userOrg = userData as unknown as {
    organization_id: string | null;
  } | null;

  if (
    !userOrg?.organization_id ||
    personData.organization_id !== userOrg.organization_id
  ) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section aria-labelledby="edit-person-heading">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/people"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Volver a la lista de personas"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div>
            <h1
              id="edit-person-heading"
              className="text-xl font-bold text-foreground sm:text-2xl"
            >
              Editar Persona
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Actualiza los datos de {personData.first_name}{" "}
              {personData.last_name}
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section aria-labelledby="form-heading">
        <h2 id="form-heading" className="sr-only">
          Formulario de edición
        </h2>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <EditPersonForm person={person as Person} />
        </div>
      </section>
    </div>
  );
}
