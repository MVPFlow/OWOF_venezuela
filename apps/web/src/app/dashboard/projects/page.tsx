import { FolderKanban } from "lucide-react";

export const metadata = {
  title: "Proyectos",
  description: "Gestión de proyectos",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <section aria-labelledby="projects-heading">
        <h1
          id="projects-heading"
          className="text-xl font-bold text-foreground sm:text-2xl"
        >
          Proyectos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona los proyectos de la organización
        </p>
      </section>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FolderKanban className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          No hay proyectos registrados
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Los proyectos aparecerán aquí una vez creados
        </p>
      </div>
    </div>
  );
}
