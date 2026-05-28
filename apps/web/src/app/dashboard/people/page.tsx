import { Plus } from "lucide-react";
import Link from "next/link";
import { PersonList } from "@/domains/people/components/PersonList";

export const metadata = {
  title: "Personas",
  description: "Gestión de personas registradas en la plataforma",
};

export default function PeoplePage() {
  return (
    <div className="space-y-6">
      <section aria-labelledby="people-heading">
        <div className="flex items-center justify-between">
          <div>
            <h1
              id="people-heading"
              className="text-xl font-bold text-foreground sm:text-2xl"
            >
              Personas
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona las personas registradas en la plataforma
            </p>
          </div>
          <Link
            href="/dashboard/people/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nueva persona
          </Link>
        </div>
      </section>
      <section aria-labelledby="people-list-heading">
        <h2 id="people-list-heading" className="sr-only">
          Lista de personas
        </h2>
        <PersonList />
      </section>
    </div>
  );
}
