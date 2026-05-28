import { PersonList } from "@/domains/people/components/PersonList";

export const metadata = {
  title: "Personas",
  description: "Gestión de personas registradas",
};

export default function PeoplePage() {
  return (
    <div className="space-y-6">
      <section aria-labelledby="people-heading">
        <div className="flex items-center justify-between">
          <h1
            id="people-heading"
            className="text-xl font-bold text-foreground sm:text-2xl"
          >
            Personas
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona las personas registradas en la plataforma
        </p>
      </section>
      <PersonList />
    </div>
  );
}
