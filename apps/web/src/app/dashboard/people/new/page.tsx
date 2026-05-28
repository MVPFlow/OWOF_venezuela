import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CreatePersonForm } from "./CreatePersonForm";

export const metadata = {
  title: "Nueva Persona",
  description: "Formulario para registrar una nueva persona",
};

export default function NewPersonPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <section aria-labelledby="new-person-heading">
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
              id="new-person-heading"
              className="text-xl font-bold text-foreground sm:text-2xl"
            >
              Nueva Persona
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Registra una nueva persona en la plataforma
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section aria-labelledby="form-heading">
        <h2 id="form-heading" className="sr-only">
          Formulario de registro
        </h2>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <CreatePersonForm />
        </div>
      </section>
    </div>
  );
}